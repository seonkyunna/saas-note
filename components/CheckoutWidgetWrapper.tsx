'use client'

import dynamic from 'next/dynamic'

const CheckoutWidget = dynamic(() => import('./CheckoutWidget'), { 
  ssr: false,
  loading: () => (
    <div className="flex w-full flex-col gap-4">
      <div className="flex py-10 flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-500">결제 위젯을 불러오는 중...</p>
      </div>
    </div>
  )
})

export default function CheckoutWidgetWrapper(props: { price: number; planName: string }) {
  return <CheckoutWidget {...props} />
}
