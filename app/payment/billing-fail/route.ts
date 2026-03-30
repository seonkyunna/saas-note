import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const message = searchParams.get('message')

  console.error(`빌링 인증 실패: code=${code}, message=${message}`)

  return NextResponse.redirect(
    new URL(
      `/payment/error?code=${code || 'BILLING_FAILED'}&message=${encodeURIComponent(message || '카드 등록 중 오류가 발생했습니다.')}`,
      request.url
    )
  )
}
