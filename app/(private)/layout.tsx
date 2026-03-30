import Link from 'next/link'
import Icon from '@/components/Icon'
import { logout } from '@/app/login/actions'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 h-full w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-100 font-display">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-surface-light dark:bg-surface-dark border-r border-[#f0f2f4] dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[#f0f2f4] dark:border-gray-800 shrink-0">
          <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
            <Icon name="cloud" className="text-[24px]" fill />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#111418] dark:text-white">CloudNote</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#111418] dark:hover:text-white transition-colors" href="/dashboard">
            <Icon name="home" className="text-[22px]" />
            <span className="text-sm font-medium">홈</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#111418] dark:hover:text-white transition-colors" href="/notes">
            <Icon name="description" className="text-[22px]" />
            <span className="text-sm font-medium">내 메모</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617589] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#111418] dark:hover:text-white transition-colors" href="/settings">
            <Icon name="settings" className="text-[22px]" />
            <span className="text-sm font-medium">설정</span>
          </Link>
          <div className="my-2 border-t border-[#f0f2f4] dark:border-gray-800 mx-3 shrink-0"></div>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium" href="/billing">
            <Icon name="credit_card" className="text-[22px]" fill />
            <span className="text-sm">구독 관리</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-[#f0f2f4] dark:border-gray-800 shrink-0 flex flex-col gap-2">
          <Link className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#617589] dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors" href="/support">
            <Icon name="headset_mic" className="text-[22px]" />
            <span className="font-medium">고객센터 문의</span>
          </Link>
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#617589] dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
              <Icon name="logout" className="text-[22px]" />
              <span className="font-medium">로그아웃</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
        {children}
      </div>
    </div>
  )
}
