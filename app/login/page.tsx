'use client'

import { useState, useTransition } from 'react'
import { login, signup, signInWithOAuth } from './actions'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      let res;
      if (tab === 'login') {
        res = await login(formData)
      } else {
        res = await signup(formData)
      }

      if (res && 'error' in res && res.error) setMessage({ type: 'error', text: res.error as string })
      if (res && 'success' in res && res.success) setMessage({ type: 'success', text: res.success as string })
    })
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Left Panel: Brand & Info */}
      <div className="relative hidden lg:flex w-full lg:w-1/2 bg-primary flex-col justify-between p-12 lg:p-20 text-white overflow-hidden group/design-root">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400 opacity-20 blur-3xl mix-blend-overlay"></div>
        </div>
        
        {/* Header / Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">cloud</span>
          <span className="text-2xl font-bold tracking-tight">CloudNote</span>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            생각을 정리하는<br/>새로운 방법
          </h1>
          <p className="text-lg text-blue-100/90 font-medium leading-relaxed">
            10만 명의 사용자가 선택한 AI 메모 서비스.<br/>
            복잡한 아이디어를 클라우드에서 안전하게 관리하세요.
          </p>
        </div>
        
        {/* Footer / Image Placeholder */}
        <div className="relative z-10 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-xl max-w-md transform translate-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-3/4 bg-white/20 rounded"></div>
              <div className="h-2 w-1/2 bg-white/20 rounded"></div>
              <div className="h-2 w-full bg-white/20 rounded"></div>
              <div className="h-24 w-full bg-gradient-to-r from-blue-400/20 to-transparent rounded mt-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Forms */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden p-6 bg-primary text-white flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-2xl">cloud</span>
          <span className="text-xl font-bold">CloudNote</span>
        </div>
        
        {/* Center Container */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            
            {/* Tabs */}
            <div className="flex w-full border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setTab('login')}
                className={`flex-1 pb-4 text-center border-b-2 font-bold text-base transition-colors focus:outline-none ${tab === 'login' ? 'text-primary border-primary' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                로그인
              </button>
              <button 
                onClick={() => setTab('signup')}
                className={`flex-1 pb-4 text-center border-b-2 font-bold text-base transition-colors focus:outline-none ${tab === 'signup' ? 'text-primary border-primary' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                회원가입
              </button>
            </div>
            
            {/* Login/Signup Form Content */}
            <form action={handleSubmit} className="flex flex-col gap-5 animate-fade-in">
              {message && (
                <div className={`p-3 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                  {message.text}
                </div>
              )}
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="email">이메일</label>
                <div className="relative">
                  <input 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 px-4 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all" 
                    id="email" 
                    name="email"
                    placeholder="example@email.com" 
                    type="email" 
                    required 
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="password">비밀번호</label>
                <div className="relative">
                  <input 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 pl-4 pr-10 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all" 
                    id="password" 
                    name="password"
                    placeholder="비밀번호를 입력하세요" 
                    type="password" 
                    required 
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>
              
              {/* Actions Row (only for login) */}
              {tab === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox"/>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">로그인 상태 유지</span>
                  </label>
                  <a className="text-sm font-medium text-primary hover:text-primary-dark hover:underline" href="#">
                    비밀번호를 잊으셨나요?
                  </a>
                </div>
              )}
              
              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? '처리 중...' : (tab === 'login' ? '로그인' : '회원가입')}
              </button>
              
              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-500 dark:text-gray-400">또는</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="flex flex-col gap-3">
                {/* Google */}
                <button 
                  type="button" 
                  onClick={() => signInWithOAuth('google')}
                  className="w-full h-12 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-medium rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.7663 12.2764C23.7663 11.4607 23.6999 10.6406 23.5588 9.83807H12.2402V14.459H18.7219C18.4528 15.9494 17.5887 17.2678 16.3232 18.1056V21.1039H20.1902C22.4608 19.0139 23.7663 15.9273 23.7663 12.2764Z" fill="#4285F4"></path>
                    <path d="M12.2399 24.0008C15.4764 24.0008 18.2057 22.9382 20.1943 21.1039L16.3273 18.1055C15.2514 18.8375 13.8624 19.252 12.2442 19.252C9.11361 19.252 6.4592 17.1399 5.50678 14.3003H1.51636V17.3912C3.55344 21.4434 7.70263 24.0008 12.2399 24.0008Z" fill="#34A853"></path>
                    <path d="M5.50277 14.3003C5.00254 12.8099 5.00254 11.1961 5.50277 9.70575V6.61481H1.51662C-0.185586 10.0056 -0.185586 14.0004 1.51662 17.3912L5.50277 14.3003Z" fill="#FBBC05"></path>
                    <path d="M12.2399 4.74966C13.9507 4.7232 15.6042 5.36697 16.8432 6.54867L20.2693 3.12262C18.0999 1.0855 15.2206 -0.0344664 12.2399 0.000808666C7.70263 0.000808666 3.55344 2.55822 1.51636 6.61481L5.50251 9.70575C6.45037 6.86173 9.10934 4.74966 12.2399 4.74966Z" fill="#EA4335"></path>
                  </svg>
                  Google로 계속하기
                </button>
                {/* Kakao */}
                <button 
                  type="button" 
                  onClick={() => signInWithOAuth('kakao')}
                  className="w-full h-12 bg-kakao hover:bg-[#ebd300] border border-transparent text-kakao-text font-medium rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M12 3C7.58172 3 4 5.91015 4 9.5C4 11.757 5.14813 13.7483 6.94425 14.9669C6.83786 15.6797 6.42589 17.893 6.23077 18.5293C6.09641 18.9674 6.52994 19.2081 6.87789 18.919L10.9829 15.7176C11.3148 15.7516 11.6544 15.7692 12 15.7692C16.4183 15.7692 20 12.8591 20 9.26923C20 5.67938 16.4183 3 12 3Z" fillRule="evenodd"></path>
                  </svg>
                  카카오로 계속하기
                </button>
              </div>
            </form>
            
            {/* Footer Copy */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
              이용약관 및 개인정보 처리방침에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
