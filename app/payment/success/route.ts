import { NextResponse, NextRequest } from 'next/server'

/**
 * @deprecated 이 라우트는 단일결제 방식에서 사용되었습니다.
 * 현재는 빌링키 기반 자동결제 방식으로 전환되어 /payment/billing-success 를 사용합니다.
 * 혹시 이 라우트로 유입된 경우 결제 페이지로 리다이렉트합니다.
 */
export async function GET(request: NextRequest) {
  console.warn('[Deprecated] /payment/success 라우트 접근 — 빌링 방식으로 전환됨')
  return NextResponse.redirect(new URL('/payment?notice=billing_required', request.url))
}

