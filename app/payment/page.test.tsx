import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PaymentPage from './page'

// BillingWidgetWrapper는 client-side dynamic import — 테스트에서 모킹
vi.mock('@/components/BillingWidgetWrapper', () => ({
  default: () => <div data-testid="billing-widget">카드 등록 위젯 (mock)</div>,
}))

describe('Payment Page', () => {
  it('renders the generic header and heading', () => {
    render(<PaymentPage />)
    expect(screen.getByText('구독 플랜 선택')).toBeDefined()
  })

  it('renders pricing plans', () => {
    render(<PaymentPage />)
    expect(screen.getByText('Free')).toBeDefined()
    expect(screen.getByText('Pro')).toBeDefined()
    expect(screen.getByText('Enterprise')).toBeDefined()
    expect(screen.getAllByText('₩9,900').length).toBeGreaterThan(0)
  })

  it('renders payment summary and methods', () => {
    render(<PaymentPage />)
    expect(screen.getByText('결제 정보')).toBeDefined()
    // BillingWidget으로 교체됨 — 타이틀이 "카드 등록 및 자동결제"로 변경됨
    expect(screen.getByText('카드 등록 및 자동결제')).toBeDefined()
    // 빌링 위젯 렌더링 확인
    expect(screen.getByTestId('billing-widget')).toBeDefined()
  })
})

