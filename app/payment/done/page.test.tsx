import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PaymentDonePage from './page'

describe('Payment Done Page', () => {
  it('renders success message and order details', () => {
    render(<PaymentDonePage />)
    expect(screen.getByText('결제가 완료되었습니다!')).toBeDefined()
    expect(screen.getByText('Pro 플랜이 활성화되었습니다')).toBeDefined()
    
    // Order details
    expect(screen.getByText('주문번호')).toBeDefined()
    expect(screen.getByText('ORD-2025011234')).toBeDefined()
    expect(screen.getByText('결제 금액')).toBeDefined()
    expect(screen.getByText('₩9,900')).toBeDefined()
    expect(screen.getByText('결제 수단')).toBeDefined()
    expect(screen.getByText('신용카드 (****1234)')).toBeDefined()
  })

  it('renders action buttons', () => {
    render(<PaymentDonePage />)
    expect(screen.getByText('대시보드로 이동')).toBeDefined()
    expect(screen.getByText('영수증 다운로드')).toBeDefined()
  })
})
