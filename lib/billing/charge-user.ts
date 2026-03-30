import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6'
const PLAN_PRICE = 9900
const PLAN_NAME = 'CloudNote Pro 구독'
const BILLING_CYCLE_DAYS = 30

/**
 * Service Role 클라이언트 생성 — RLS 우회.
 * Cron Job처럼 사용자 세션이 없는 서버 환경에서 사용합니다.
 */
function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface ChargeResult {
  success: boolean
  paymentKey?: string
  orderId?: string
  amount?: number
  nextBillingAt?: string
  approvedAt?: string
  error?: string
  code?: string
}

/**
 * 빌링키로 정기결제를 실행하는 핵심 비즈니스 로직.
 * Service Role 클라이언트를 사용하므로 사용자 세션 없이도 동작합니다.
 * API 라우트, 스케줄러, Cron Job 모두에서 재사용 가능합니다.
 */
export async function chargeUser(userId: string): Promise<ChargeResult> {
  const supabase = createServiceClient()
  const encryptedSecretKey = Buffer.from(`${SECRET_KEY}:`).toString('base64')

  // ─── Step 1: 빌링키 조회 ────────────────────────────────────────────────────
  const { data: billingKeyData, error: billingKeyError } = await supabase
    .from('billing_keys')
    .select('billing_key, customer_key')
    .eq('user_id', userId)
    .single()

  if (billingKeyError || !billingKeyData) {
    return { success: false, error: '등록된 빌링키를 찾을 수 없습니다. 카드를 먼저 등록해주세요.' }
  }

  const { billing_key: billingKey, customer_key: customerKey } = billingKeyData

  // ─── Step 2: 사용자 정보 조회 ───────────────────────────────────────────────
  const { data: userProfile } = await supabase
    .from('users')
    .select('email, plan')
    .eq('id', userId)
    .single()

  // ─── Step 3: 토스페이먼츠 자동결제 승인 API 호출 ─────────────────────────────
  const orderId = `cloudnote_recurring_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`

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
      customerEmail: userProfile?.email || '',
      customerName: userProfile?.email?.split('@')[0] || '사용자',
    }),
  })

  const chargeData = await chargeRes.json()

  if (!chargeRes.ok) {
    console.error(`정기결제 실패 (userId: ${userId}):`, chargeData)
    return {
      success: false,
      error: chargeData.message || '결제 승인에 실패했습니다.',
      code: chargeData.code,
    }
  }

  // ─── Step 4: payments 이력 기록 ─────────────────────────────────────────────
  await supabase.from('payments').insert({
    user_id: userId,
    order_id: orderId,
    amount: PLAN_PRICE,
    status: 'success',
    payment_key: chargeData.paymentKey,
    billing_type: 'billing',
  })

  // ─── Step 5: next_billing_at 30일 연장 ──────────────────────────────────────
  const nextBillingAt = new Date()
  nextBillingAt.setDate(nextBillingAt.getDate() + BILLING_CYCLE_DAYS)

  await supabase
    .from('users')
    .update({ plan: 'pro', next_billing_at: nextBillingAt.toISOString() })
    .eq('id', userId)

  return {
    success: true,
    paymentKey: chargeData.paymentKey,
    orderId,
    amount: PLAN_PRICE,
    nextBillingAt: nextBillingAt.toISOString(),
    approvedAt: chargeData.approvedAt,
  }
}
