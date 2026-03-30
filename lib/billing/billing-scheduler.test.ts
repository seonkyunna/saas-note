import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTodayDueBillingKeys,
  runDailyBillingJob,
  type DueBillingKey,
} from './billing-scheduler'

// ─── vi.hoisted: vi.mock보다 먼저 실행되어야 하는 변수 ───────────────────────
const { mockFrom, mockSupabase, mockChargeUser } = vi.hoisted(() => {
  const mockFrom = vi.fn()
  const mockSupabase = { from: mockFrom }
  const mockChargeUser = vi.fn()
  return { mockFrom, mockSupabase, mockChargeUser }
})

// ─── Supabase 클라이언트 모킹 ─────────────────────────────────────────────────
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}))

// ─── chargeUser 함수 모킹 (HTTP 호출 없이 직접 호출됨) ───────────────────────
vi.mock('./charge-user', () => ({
  chargeUser: mockChargeUser,
}))

// ─── 테스트 픽스처 ──────────────────────────────────────────────────────────
const makeUser = (id: string, next_billing_at: string): DueBillingKey => ({
  user_id: id,
  billing_key: `bk_${id}`,
  customer_key: `ck_${id}`,
  next_billing_at,
  user_email: `${id}@test.com`,
})

const today = () => new Date().toISOString().split('T')[0]

// ─── Supabase 체이닝 헬퍼 ────────────────────────────────────────────────────
const mockSupabaseQuery = (data: any[], error: any = null) => {
  mockFrom.mockReturnValue({
    select: vi.fn().mockReturnValue({
      lte: vi.fn().mockReturnValue({
        gte: vi.fn().mockResolvedValue({ data, error }),
      }),
    }),
  })
}

// ─────────────────────────────────────────────────────────────────────────────

describe('getTodayDueBillingKeys', () => {
  beforeEach(() => vi.clearAllMocks())

  it('오늘 결제일인 사용자 목록을 반환한다', async () => {
    const fixtures = [
      makeUser('user-1', `${today()}T00:00:00.000Z`),
      makeUser('user-2', `${today()}T23:59:59.000Z`),
    ]
    mockSupabaseQuery(fixtures)

    const result = await getTodayDueBillingKeys()

    expect(result).toHaveLength(2)
    expect(result[0].user_id).toBe('user-1')
    expect(result[1].user_id).toBe('user-2')
  })

  it('next_billing_at이 null인 사용자는 제외한다', async () => {
    mockSupabaseQuery([])
    const result = await getTodayDueBillingKeys()
    expect(result).toHaveLength(0)
  })

  it('DB 오류 발생 시 빈 배열을 반환하고 에러를 로깅한다', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSupabaseQuery(null as any, { message: 'DB connection failed' })

    const result = await getTodayDueBillingKeys()
    expect(result).toHaveLength(0)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('오늘 결제 대상 조회 실패'),
      expect.anything()
    )
    consoleSpy.mockRestore()
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('runDailyBillingJob', () => {
  beforeEach(() => vi.clearAllMocks())

  it('오늘 결제 대상이 없으면 chargeUser를 호출하지 않는다', async () => {
    mockSupabaseQuery([])

    const result = await runDailyBillingJob()

    expect(mockChargeUser).not.toHaveBeenCalled()
    expect(result.total).toBe(0)
    expect(result.succeeded).toBe(0)
    expect(result.failed).toBe(0)
  })

  it('결제 대상이 있으면 각 userId마다 chargeUser를 호출한다', async () => {
    mockSupabaseQuery([makeUser('user-1', `${today()}T00:00:00.000Z`)])
    mockChargeUser.mockResolvedValueOnce({ success: true, paymentKey: 'pk_test' })

    const result = await runDailyBillingJob()

    expect(mockChargeUser).toHaveBeenCalledTimes(1)
    expect(mockChargeUser).toHaveBeenCalledWith('user-1')
    expect(result.total).toBe(1)
    expect(result.succeeded).toBe(1)
    expect(result.failed).toBe(0)
  })

  it('일부 결제가 실패하더라도 나머지 결제는 계속 진행한다', async () => {
    mockSupabaseQuery([
      makeUser('user-1', `${today()}T00:00:00.000Z`),
      makeUser('user-2', `${today()}T00:00:00.000Z`),
      makeUser('user-3', `${today()}T00:00:00.000Z`),
    ])

    // user-1: 성공, user-2: 실패, user-3: 성공
    mockChargeUser
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: '잔액 부족' })
      .mockResolvedValueOnce({ success: true })

    const result = await runDailyBillingJob()

    expect(mockChargeUser).toHaveBeenCalledTimes(3)
    expect(result.total).toBe(3)
    expect(result.succeeded).toBe(2)
    expect(result.failed).toBe(1)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0].userId).toBe('user-2')
  })

  it('결과에 각 사용자별 성공/실패 상세 정보를 포함한다', async () => {
    mockSupabaseQuery([makeUser('user-1', `${today()}T00:00:00.000Z`)])
    mockChargeUser.mockResolvedValueOnce({ success: true, paymentKey: 'pk_abc', amount: 9900 })

    const result = await runDailyBillingJob()

    expect(result.results).toHaveLength(1)
    expect(result.results[0]).toMatchObject({
      userId: 'user-1',
      success: true,
    })
  })
})

