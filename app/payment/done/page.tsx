import Link from 'next/link'

export default function PaymentDonePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-body h-full flex flex-col">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        {/* Central Card */}
        <div className="w-full max-w-[480px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden border border-gray-100 dark:border-gray-800">
          
          {/* Success Header Section */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
            <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[48px]">check</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main dark:text-white mb-2">
              결제가 완료되었습니다!
            </h1>
            <p className="text-text-secondary dark:text-gray-400 text-base sm:text-lg">
              Pro 플랜이 활성화되었습니다
            </p>
          </div>

          {/* Divider */}
          <div className="px-8">
            <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
          </div>

          {/* Payment Details List */}
          <div className="px-8 py-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary dark:text-gray-400">주문번호</span>
              <span className="font-medium text-text-main dark:text-gray-200">ORD-2025011234</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary dark:text-gray-400">결제 금액</span>
              <span className="font-bold text-lg text-primary">₩9,900</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary dark:text-gray-400">결제 수단</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-text-secondary dark:text-gray-500">credit_card</span>
                <span className="font-medium text-text-main dark:text-gray-200">신용카드 (****1234)</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary dark:text-gray-400">결제 일시</span>
              <span className="font-medium text-text-main dark:text-gray-200">2025년 1월 15일 14:30</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary dark:text-gray-400">다음 결제일</span>
              <span className="font-medium text-text-main dark:text-gray-200">2025년 2월 15일</span>
            </div>
          </div>

          {/* Divider */}
          <div className="px-8">
            <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 flex flex-col gap-4">
            <Link href="/dashboard" className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group">
              <span>대시보드로 이동</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </Link>
            <button className="flex items-center justify-center gap-2 text-primary hover:text-blue-700 text-sm font-medium transition-colors py-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              영수증 다운로드
            </button>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 text-center border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-text-secondary dark:text-gray-500 leading-relaxed">
              결제 확인 이메일을 발송했습니다.<br/>
              문의사항이 있으시면 <Link href="#" className="underline hover:text-text-main dark:hover:text-gray-300">고객센터</Link>로 연락해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
