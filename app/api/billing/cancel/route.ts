import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/billing/cancel
 *
 * 구독을 취소합니다.
 * - billing_keys 테이블에서 해당 사용자의 빌링키를 삭제 (다음 결제 차단)
 * - users.plan은 변경하지 않음 (next_billing_at까지 서비스 이용 유지)
 * - users.next_billing_at을 null로 초기화하여 cron job 대상에서 제외
 */
export async function POST() {
  try {
    // ─── 현재 로그인 사용자 확인 (세션 쿠키 기반) ─────────────────────────────
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    // ─── Service Role 클라이언트로 DB 작업 수행 ────────────────────────────────
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ─── Step 1: 빌링키 존재 여부 확인 ──────────────────────────────────────────
    const { data: billingKey } = await adminSupabase
      .from('billing_keys')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!billingKey) {
      return NextResponse.json(
        { error: '등록된 빌링키가 없습니다.' },
        { status: 404 }
      )
    }

    // ─── Step 2: billing_keys 삭제 (다음 결제 중단) ──────────────────────────────
    const { error: deleteError } = await adminSupabase
      .from('billing_keys')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('빌링키 삭제 실패:', deleteError)
      return NextResponse.json(
        { error: '구독 취소 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // ─── Step 3: next_billing_at 제거 (cron job 대상에서 제외) ──────────────────
    // plan은 그대로 유지 → 기존 결제일까지 서비스 이용 가능
    await adminSupabase
      .from('users')
      .update({ next_billing_at: null })
      .eq('id', user.id)

    revalidatePath('/dashboard', 'layout')

    return NextResponse.json({
      success: true,
      message: '구독이 취소되었습니다. 현재 플랜은 사용 권한이 종료될 때까지 유지됩니다.',
    })
  } catch (error: any) {
    console.error('구독 취소 API 오류:', error)
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
