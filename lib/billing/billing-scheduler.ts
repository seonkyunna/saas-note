import { createClient } from '@/utils/supabase/server'
import { chargeUser } from './charge-user'

export interface DueBillingKey {
  user_id: string
  billing_key: string
  customer_key: string
  next_billing_at: string
  user_email: string
}

export interface BillingJobResult {
  total: number
  succeeded: number
  failed: number
  failures: { userId: string; error: string }[]
  results: { userId: string; success: boolean; data?: any; error?: string }[]
}

/**
 * 오늘 결제해야 하는 빌링키를 모두 조회합니다.
 *
 * "오늘 결제 대상" 기준:
 *   next_billing_at이 오늘 날짜(00:00:00 ~ 23:59:59) 범위 내에 있는 모든 사용자
 *   (시간 무관, 날짜만 비교)
 */
export async function getTodayDueBillingKeys(): Promise<DueBillingKey[]> {
  try {
    const supabase = await createClient()

    // 오늘 날짜의 시작(00:00:00)과 끝(23:59:59.999)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('billing_keys')
      .select(`
        user_id,
        billing_key,
        customer_key,
        users!inner(next_billing_at, email)
      `)
      .lte('users.next_billing_at', todayEnd.toISOString())
      .gte('users.next_billing_at', todayStart.toISOString())

    if (error) {
      console.error('오늘 결제 대상 조회 실패:', error)
      return []
    }

    return (data ?? []).map((row: any) => ({
      user_id: row.user_id,
      billing_key: row.billing_key,
      customer_key: row.customer_key,
      next_billing_at: row.users?.next_billing_at ?? '',
      user_email: row.users?.email ?? '',
    }))
  } catch (err) {
    console.error('오늘 결제 대상 조회 실패:', err)
    return []
  }
}

/**
 * 오늘 결제 대상 빌링키를 모두 조회한 뒤,
 * chargeUser()를 직접 호출하여 정기결제를 실행합니다.
 * (HTTP fetch 없이 함수를 직접 호출 — 서버 내부 호출 문제 없음)
 *
 * - 일부 결제 실패 시에도 나머지 결제는 계속 진행합니다.
 * - 결과에는 전체 통계 및 사용자별 상세 내역이 포함됩니다.
 */
export async function runDailyBillingJob(): Promise<BillingJobResult> {
  const dueKeys = await getTodayDueBillingKeys()

  const result: BillingJobResult = {
    total: dueKeys.length,
    succeeded: 0,
    failed: 0,
    failures: [],
    results: [],
  }

  if (dueKeys.length === 0) {
    return result
  }

  // 각 사용자에 대해 순차 처리 (rate limit 방지)
  for (const { user_id } of dueKeys) {
    try {
      // HTTP fetch 없이 함수 직접 호출
      const chargeResult = await chargeUser(user_id)

      if (chargeResult.success) {
        result.succeeded++
        result.results.push({ userId: user_id, success: true, data: chargeResult })
      } else {
        const errMsg = chargeResult.error || '결제 실패'
        result.failed++
        result.failures.push({ userId: user_id, error: errMsg })
        result.results.push({ userId: user_id, success: false, error: errMsg })
        console.error(`정기결제 실패 (userId: ${user_id}):`, errMsg)
      }
    } catch (err: any) {
      const errMsg = err.message || '알 수 없는 오류'
      result.failed++
      result.failures.push({ userId: user_id, error: errMsg })
      result.results.push({ userId: user_id, success: false, error: errMsg })
      console.error(`정기결제 예외 (userId: ${user_id}):`, err)
    }
  }

  return result
}

