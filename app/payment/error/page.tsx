'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const message = searchParams.get('message')
  const isCancelled = code === 'PAY_PROCESS_CANCELED'

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${isCancelled ? 'bg-amber-100' : 'bg-red-100'}`}>
        <span className={`material-symbols-outlined text-4xl ${isCancelled ? 'text-amber-500' : 'text-red-500'}`}>
          {isCancelled ? 'warning' : 'error'}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">
          {isCancelled ? '결제가 취소되었습니다' : '결제에 실패했습니다'}
        </h1>
        <p className="text-sm text-[#637588] dark:text-gray-400">
          {message ? message : (isCancelled ? '사용자가 결제 위젯을 닫았거나 결제 시도를 취소했습니다.' : '일시적인 오류로 결제가 실패했습니다.')}
        </p>
        {!isCancelled && code && (
          <p className="mt-2 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            에러 코드: {code}
          </p>
        )}
      </div>
      <div className="mt-4 w-full border-t border-dashed border-[#e5e7eb] dark:border-gray-700"></div>
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/payment"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-md transition-all hover:bg-primary-dark"
        >
          다시 시도하기
        </Link>
        <Link
          href="/dashboard"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f3f4f6] text-base font-bold text-[#111418] transition-all hover:bg-[#e5e7eb] dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default function PaymentErrorPage() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#111418]">
        <Suspense fallback={<div className="p-10 text-center">결제 오류 정보를 불러오는 중...</div>}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  )
}
