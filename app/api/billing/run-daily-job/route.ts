import { NextResponse, NextRequest } from 'next/server'
import { runDailyBillingJob } from '@/lib/billing/billing-scheduler'

/**
 * GET /api/billing/run-daily-job
 *
 * 오늘 결제 대상 빌링키를 조회하고 일괄 결제를 실행합니다.
 *
 * 보안: Authorization 헤더의 Bearer 토큰이 CRON_SECRET과 일치해야 합니다.
 *
 * Vercel cron.json 설정 예시:
 *   { "path": "/api/billing/run-daily-job", "schedule": "0 0 * * *" }
 *
 * 개발/테스트:
 *   curl http://localhost:3000/api/billing/run-daily-job \
 *     -H "Authorization: Bearer <CRON_SECRET>"
 */
export async function GET(request: NextRequest) {
  // ─── 시크릿 검증 ────────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // 개발 환경에서는 CRON_SECRET 미설정 시 통과 허용
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 })
    }
  }

  try {
    const result = await runDailyBillingJob()

    return NextResponse.json({
      success: true,
      executedAt: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('일일 빌링 잡 실행 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
