'use client'

import dynamic from 'next/dynamic'

const BillingWidget = dynamic(() => import('./BillingWidget'), {
  ssr: false,
  loading: () => (
    <div className="flex w-full flex-col gap-4">
      <div className="flex py-10 flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">카드 등록 위젯을 불러오는 중...</p>
      </div>
    </div>
  ),
})

export default function BillingWidgetWrapper(props: { price: number; planName: string }) {
  return <BillingWidget {...props} />
}
