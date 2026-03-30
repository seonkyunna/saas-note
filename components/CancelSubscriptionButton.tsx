'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CancelSubscriptionButtonProps {
  nextBillingAt?: string | null
}

export default function CancelSubscriptionButton({ nextBillingAt }: CancelSubscriptionButtonProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formattedDate = nextBillingAt
    ? new Date(nextBillingAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  const handleCancel = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '구독 취소 중 오류가 발생했습니다.')
        return
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 구독 취소 버튼 */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex-1 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        구독 취소
      </button>

      {/* 확인 다이얼로그 */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isLoading && setIsDialogOpen(false)}
          />

          {/* 다이얼로그 카드 */}
          <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            {/* 아이콘 + 제목 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  구독을 취소하시겠습니까?
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            {/* 안내 박스 */}
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                취소 후에도 아래 혜택은 유지됩니다
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                {formattedDate ? (
                  <li><span className="font-medium">{formattedDate}</span>까지 Pro 플랜 사용 가능</li>
                ) : (
                  <li>현재 결제 주기가 끝날 때까지 Pro 플랜 사용 가능</li>
                )}
                <li>이후 자동으로 Free 플랜으로 전환됩니다</li>
                <li>저장된 노트와 데이터는 유지됩니다</li>
              </ul>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* 버튼 영역 */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
                className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                돌아가기
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    처리 중...
                  </>
                ) : '구독 취소 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
