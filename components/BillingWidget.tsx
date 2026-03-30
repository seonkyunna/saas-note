'use client'

import { useEffect, useState, useTransition } from 'react'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { getBillingCustomerKey } from '@/app/payment/actions'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'

interface BillingWidgetProps {
  price: number
  planName: string
}

export default function BillingWidget({ price, planName }: BillingWidgetProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // SDK 사전 로드 확인
    loadTossPayments(TOSS_CLIENT_KEY)
      .then(() => setIsLoaded(true))
      .catch((err: any) => {
        console.error('TossPayments SDK 로드 실패', err)
        setErrorMessage(`SDK 로드 실패: ${err.message}`)
      })
  }, [])

  const handleBillingAuth = () => {
    startTransition(async () => {
      try {
        // 1. 서버에서 customerKey, 이메일, 이름 조회
        const { customerKey, userEmail, userName } = await getBillingCustomerKey()

        // 2. SDK 초기화 & payment 인스턴스 생성
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
        const payment = tossPayments.payment({ customerKey })

        // 3. 빌링키 발급 요청 (카드 등록 결제창 오픈)
        await payment.requestBillingAuth({
          method: 'CARD',
          successUrl: `${window.location.origin}/payment/billing-success`,
          failUrl: `${window.location.origin}/payment/billing-fail`,
          customerEmail: userEmail,
          customerName: userName,
        })
      } catch (error: any) {
        console.error('빌링 인증 요청 실패', error)
        // 사용자가 직접 창을 닫은 경우 에러 메시지 표시 억제
        if (error?.code !== 'USER_CANCEL') {
          setErrorMessage(error.message || '카드 등록 중 오류가 발생했습니다.')
        }
      }
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {errorMessage && (
        <div className="flex py-6 flex-col items-center justify-center rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-2 text-xs text-red-500 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 빌링 안내 박스 */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1a2632]">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">credit_card</span>
            <div>
              <h3 className="text-sm font-bold text-[#111418] dark:text-white">자동결제(정기구독) 카드 등록</h3>
              <p className="mt-1 text-xs text-[#637588] dark:text-gray-400">
                카드를 한 번 등록하면 30일마다 자동으로 결제됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 text-xs text-[#637588] dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
              <span>최초 카드 등록 시 바로 첫 번째 결제가 진행됩니다.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
              <span>이후 30일마다 <strong className="text-[#111418] dark:text-white">{price.toLocaleString()}원</strong>이 자동 결제됩니다.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
              <span>구독 취소는 언제든 계정 설정에서 가능합니다.</span>
            </div>
          </div>

          <button
            onClick={handleBillingAuth}
            disabled={isPending || !isLoaded}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                카드 등록 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">lock</span>
                카드 등록하고 {price.toLocaleString()}원 결제하기
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#637588] dark:text-gray-500">
        토스페이먼츠의 보안 결제창을 통해 안전하게 카드 정보가 처리됩니다.
      </p>
    </div>
  )
}
