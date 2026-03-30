'use client'

import { useEffect, useState, useRef, useTransition } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { createPendingPayment } from '@/app/payment/actions'

interface CheckoutWidgetProps {
  price: number
  planName: string
}

export default function CheckoutWidget({ price, planName }: CheckoutWidgetProps) {
  const [widgets, setWidgets] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const renderRef = useRef(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function initWidget() {
      try {
        const tossPayments = await loadTossPayments('test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm')
        const widgetsInstance = tossPayments.widgets({ customerKey: 'test_customer_key' })
        setWidgets(widgetsInstance)
      } catch (error: any) {
        console.error('Failed to load Toss Payments SDK', error)
        setErrorMessage(`SDK 로드 실패: ${error.message}`)
      }
    }
    initWidget()
  }, [])

  useEffect(() => {
    async function renderWidgets() {
      if (!widgets || renderRef.current) return

      try {
        renderRef.current = true
        await widgets.setAmount({ currency: 'KRW', value: price })
        
        await widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' })
        await widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })
        
        setIsReady(true)
      } catch (error: any) {
        console.error('Failed to render widgets', error)
        setErrorMessage(`위젯 렌더링 실패: ${error.message}`)
        renderRef.current = false // Allow retry on error
      }
    }
    renderWidgets()
  }, [widgets, price])

  const handlePayment = async () => {
    if (!widgets) return

    startTransition(async () => {
      try {
        // 1. Create a tracking record in our database
        const { orderId } = await createPendingPayment(price)
        
        // 2. Request payment via Toss SDK
        await widgets.requestPayment({
          orderId: orderId,
          orderName: planName,
          successUrl: window.location.origin + '/payment/success',
          failUrl: window.location.origin + '/payment/fail',
          customerEmail: 'customer@cloudnote.com',
          customerName: '홍길동',
        })
      } catch (error: any) {
        console.error('Payment request failed', error)
        setErrorMessage(error.message || '결제 요청 중 오류가 발생했습니다.')
      }
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {errorMessage && (
        <div className="flex py-10 flex-col items-center justify-center text-red-500 font-bold p-4 bg-red-50 rounded-lg">
          {errorMessage}
        </div>
      )}

      {!isReady && !errorMessage && (
        <div className="flex py-10 flex-col items-center justify-center">
          <p className="text-sm font-medium text-slate-500">결제 위젯을 불러오는 중...</p>
        </div>
      )}
      
      {/* Widget Containers */}
      <div id="payment-method" className="w-full" />
      <div id="agreement" className="w-full" />

      {isReady && (
        <button
          onClick={handlePayment}
          disabled={isPending}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? (
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-xl">lock</span>
          )}
          {isPending ? '결제 정보 확인 중...' : `${price.toLocaleString()}원 결제하기`}
        </button>
      )}
    </div>
  )
}
