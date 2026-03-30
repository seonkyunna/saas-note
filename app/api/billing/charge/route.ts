import { NextResponse, NextRequest } from 'next/server'
import { chargeUser } from '@/lib/billing/charge-user'

/**
 * POST /api/billing/charge
 *
 * 정기결제 실행 엔드포인트.
 * 스케줄러(또는 관리자)가 결제일에 호출하여 사용자의 구독 요금을 청구합니다.
 *
 * 요청 본문:
 *   { "userId": "사용자 UUID" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId는 필수입니다.' }, { status: 400 })
    }

    const result = await chargeUser(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.code === 'NOT_FOUND' ? 404 : 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('charge API 오류:', error)
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

