import Link from "next/link";
import PricingCard from "@/components/PricingCard";

export default function LandingPage() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-white text-slate-900 font-display antialiased">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden py-16 lg:py-24">
          <div className="layout-container flex w-full flex-col px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
              {/* Hero Content Wrapper */}
              <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 text-center shadow-xl">
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 z-0" 
                  style={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgof8TGt21GoqgMQM84jRCAHTStsMDu0OZgjWaLyDiO6-rniB7KoyWQ9rMbb0AnIxfFbSNP11l7FJ6fseJ0O9u7Io1Iv8nNAdlIDXEAzGQIvkb2e_k-cSV3OEVvSABntCfhsn43QIQuatuvYWMj5DwOdWgq2HVc82YrJ0WY-qKqv66zYZCnlElwyqW0BAzUTS8xeVNSpfqXnil7ak4NZBNWNSZLRwm0AueeUky5m1RRO6gDPmO7rBRmqFC3wVMpyM6ED0pHrDd')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                
                {/* Hero Text Content */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-20 sm:px-12 md:py-32">
                  <div className="flex flex-col gap-3 max-w-3xl">
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                      당신의 아이디어를 클라우드에
                    </h1>
                    <h2 className="text-lg font-medium leading-relaxed text-slate-200 sm:text-xl">
                      어디서든 메모하고, AI가 정리해드립니다
                    </h2>
                  </div>
                  <Link href="/login" className="mt-4 flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white transition-transform hover:scale-105 hover:bg-primary-dark">
                    무료로 시작하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section Header */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">요금제</h2>
            <p className="mt-4 text-lg text-slate-600">당신에게 가장 적합한 플랜을 선택하세요</p>
          </div>
        </section>
        
        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <PricingCard
                name="Free"
                price="₩0"
                buttonText="현재 플랜"
                buttonVariant="disabled"
                features={['메모 100개', '기본 AI 요약', '1GB 저장공간']}
              />
              <PricingCard
                name="Pro"
                price="₩9,900"
                isPopular={true}
                popularBadgeText="인기"
                buttonText="Pro 시작하기"
                buttonVariant="primary"
                features={['메모 무제한', '고급 AI 요약 및 검색', '10GB 저장공간', '팀 공유 기능']}
              />
              <PricingCard
                name="Enterprise"
                price="₩29,900"
                buttonText="문의하기"
                buttonVariant="secondary"
                features={['Pro의 모든 기능', '무제한 저장공간', '전용 고객 지원', 'SSO 로그인']}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
