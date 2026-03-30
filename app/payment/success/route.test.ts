import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

/**
 * /payment/success 라우트는 단일결제 방식에서 사용되었으며,
 * 현재는 빌링키 기반 자동결제(/payment/billing-success)로 전환되어 deprecated 상태입니다.
 * 해당 라우트는 모든 요청을 /payment?notice=billing_required 로 리다이렉트합니다.
 */
describe('GET /payment/success (deprecated)', () => {
  it('파라미터 없이 접근해도 /payment?notice=billing_required 로 리다이렉트한다', async () => {
    const req = new NextRequest('http://localhost:3000/payment/success')
    const res = await GET(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/payment')
    expect(res.headers.get('Location')).toContain('billing_required')
  })

  it('파라미터가 있어도 /payment?notice=billing_required 로 리다이렉트한다', async () => {
    const req = new NextRequest(
      'http://localhost:3000/payment/success?paymentKey=key123&orderId=order123&amount=9900'
    )
    const res = await GET(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('Location')).toContain('/payment')
    expect(res.headers.get('Location')).toContain('billing_required')
  })
})

