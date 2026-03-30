import Link from "next/link";
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'
import Icon from './Icon';

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur shrink-0 text-slate-900">
      <div className="mx-auto flex h-14 md:h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-primary flex items-center justify-center">
              <Icon name="cloud" fill className="text-[28px] md:text-[32px] leading-none" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-gray-100">CloudNote</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden text-sm font-medium text-[#637588] hover:text-[#111418] dark:text-gray-400 dark:hover:text-white sm:block">지원센터</button>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <Icon name="account_circle" className="text-[20px]" />
                <span className="max-w-[150px] truncate">{user.email}</span>
              </Link>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">로그아웃</button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="flex h-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#111418] px-4 text-sm font-bold text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <span className="truncate">로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
