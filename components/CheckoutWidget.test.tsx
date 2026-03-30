import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CheckoutWidget from './CheckoutWidget'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

// Mock the Toss Payments SDK
vi.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: vi.fn(),
}))

describe('CheckoutWidget', () => {
  const mockRenderPaymentMethods = vi.fn()
  const mockRenderAgreement = vi.fn()
  const mockRequestPayment = vi.fn()
  const mockSetAmount = vi.fn()

  const mockWidgets = {
    setAmount: mockSetAmount,
    renderPaymentMethods: mockRenderPaymentMethods,
    renderAgreement: mockRenderAgreement,
    requestPayment: mockRequestPayment,
  }

  const mockTossPayments = {
    widgets: vi.fn().mockReturnValue(mockWidgets),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(loadTossPayments as any).mockResolvedValue(mockTossPayments)
  })

  it('renders the checkout widget containers', async () => {
    render(<CheckoutWidget price={9900} planName="Pro 플랜" />)

    // The component should render the initial loading state or container
    expect(screen.getByText('결제 위젯을 불러오는 중...')).toBeDefined()
  })

  it('initializes Toss Payments SDK on mount', async () => {
    render(<CheckoutWidget price={9900} planName="Pro 플랜" />)

    await waitFor(() => {
      expect(loadTossPayments).toHaveBeenCalledWith('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')
      expect(mockTossPayments.widgets).toHaveBeenCalledWith({ customerKey: 'test_customer_key' })
      expect(mockSetAmount).toHaveBeenCalledWith({ currency: 'KRW', value: 9900 })
      expect(mockRenderPaymentMethods).toHaveBeenCalledWith({ selector: '#payment-method', variantKey: 'DEFAULT' })
      expect(mockRenderAgreement).toHaveBeenCalledWith({ selector: '#agreement', variantKey: 'AGREEMENT' })
    })

    // Loading text should disappear
    expect(screen.queryByText('결제 위젯을 불러오는 중...')).toBeNull()
  })

  it('calls requestPayment when the order button is clicked', async () => {
    render(<CheckoutWidget price={9900} planName="Pro 플랜" />)

    // Wait until loading is done and button appears
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /결제하기/ })).toBeDefined()
    })

    const button = screen.getByRole('button', { name: /결제하기/ })
    fireEvent.click(button)

    expect(mockRequestPayment).toHaveBeenCalledWith(expect.objectContaining({
      orderId: expect.any(String),
      orderName: 'Pro 플랜',
      successUrl: expect.stringContaining('/payment/done'),
      failUrl: expect.stringContaining('/payment/fail'),
    }))
  })
})
