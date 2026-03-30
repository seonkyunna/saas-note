import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

const SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'
const PLAN_PRICE = 9900       // Pro 플랜 가격 (원)
const PLAN_NAME = 'CloudNote Pro 구독'
const BILLING_CYCLE_DAYS = 30 // 정기결제 주기 (일)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const authKey = searchParams.get('authKey')
  const customerKey = searchParams.get('customerKey')

  if (!authKey || !customerKey) {
    return NextResponse.redirect(new URL('/payment/billing-fail?code=MISSING_PARAMS&message=authKey 또는 customerKey가 없습니다.', request.url))
  }

  const encryptedSecretKey = Buffer.from(`${SECRET_KEY}:`).toString('base64')

  try {
    // ─── Step 1: 빌링키 발급 API 호출 ─────────────────────────────────────────
    const billingAuthRes = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authKey, customerKey }),
    })

    if (!billingAuthRes.ok) {
      const errBody = await billingAuthRes.json().catch(() => ({}))
      console.error('빌링키 발급 실패:', errBody)
      return NextResponse.redirect(
        new URL(`/payment/billing-fail?code=${errBody.code || 'BILLING_AUTH_FAILED'}&message=${encodeURIComponent(errBody.message || '빌링키 발급에 실패했습니다.')}`, request.url)
      )
    }

    const billingData = await billingAuthRes.json()
    const billingKey = billingData.billingKey
    const cardNumber = billingData.card?.number || billingData.cardNumber || null
    const cardCompany = billingData.cardCompany || null
    const method = billingData.method || 'CARD'

    // ─── Step 2: Supabase에서 현재 사용자 확인 ────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        new URL('/payment/billing-fail?code=SESSION_LOST&message=세션이 만료되었습니다. 다시 로그인해주세요.', request.url)
      )
    }

    // ─── Step 3: billing_keys 테이블에 저장 (upsert: 기존 키 교체) ──────────
    const { error: billingKeyError } = await supabase
      .from('billing_keys')
      .upsert(
        {
          user_id: user.id,
          billing_key: billingKey,
          customer_key: customerKey,
          card_number: cardNumber,
          card_company: cardCompany,
          method,
        },
        { onConflict: 'user_id' }
      )

    if (billingKeyError) {
      console.error('빌링키 저장 실패:', billingKeyError)
      return NextResponse.redirect(
        new URL(`/payment/billing-fail?code=DB_ERROR&message=${encodeURIComponent('빌링키 저장에 실패했습니다.')}`, request.url)
      )
    }

    // ─── Step 4: 첫 번째 자동결제 승인 ──────────────────────────────────────
    const orderId = `cloudnote_billing_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`

    const chargeRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        amount: PLAN_PRICE,
        orderId,
        orderName: PLAN_NAME,
        customerEmail: user.email,
        customerName: user.email?.split('@')[0] || '사용자',
      }),
    })

    if (!chargeRes.ok) {
      const errBody = await chargeRes.json().catch(() => ({}))
      console.error('첫 번째 결제 실패:', errBody)
      return NextResponse.redirect(
        new URL(`/payment/billing-fail?code=${errBody.code || 'CHARGE_FAILED'}&message=${encodeURIComponent(errBody.message || '첫 번째 결제에 실패했습니다.')}`, request.url)
      )
    }

    const chargeData = await chargeRes.json()
    const paymentKey = chargeData.paymentKey

    // ─── Step 5: users 테이블 plan 업그레이드 & next_billing_at 설정 ─────────
    const nextBillingAt = new Date()
    nextBillingAt.setDate(nextBillingAt.getDate() + BILLING_CYCLE_DAYS)

    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        plan: 'pro',
        next_billing_at: nextBillingAt.toISOString(),
      })
      .eq('id', user.id)

    if (userUpdateError) {
      console.error('사용자 플랜 업데이트 실패:', userUpdateError)
    }

    // ─── Step 6: payments 테이블에 결제 이력 기록 ────────────────────────────
    await supabase.from('payments').insert({
      user_id: user.id,
      order_id: orderId,
      amount: PLAN_PRICE,
      status: 'success',
      payment_key: paymentKey,
      billing_type: 'billing',
    })

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.redirect(new URL('/payment/done', request.url))
  } catch (error: any) {
    console.error('billing-success 라우트 오류:', error)
    return NextResponse.redirect(
      new URL(`/payment/billing-fail?code=SERVER_ERROR&message=${encodeURIComponent(error.message || '서버 오류가 발생했습니다.')}`, request.url)
    )
  }
}
