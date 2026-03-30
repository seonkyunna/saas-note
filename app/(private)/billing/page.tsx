import Icon from '@/components/Icon'
import Link from 'next/link'

export default function BillingPage() {
  return (
    <div className="flex h-full w-full flex-col p-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">구독 관리</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">현재 사용 중인 플랜과 결제 정보를 관리하세요.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-surface-dark">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500 dark:text-gray-400">현재 플랜</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">Free</span>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">사용 중</span>
                </div>
              </div>
              <Link href="/payment" className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                <Icon name="upgrade" className="text-[18px]" />
                플랜 업그레이드
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
