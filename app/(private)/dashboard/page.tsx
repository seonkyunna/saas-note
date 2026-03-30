import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CancelSubscriptionButton from '@/components/CancelSubscriptionButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user session
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch Public User Profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch Recent Notes
  const { data: recentNotes } = await supabase
    .from('notes')
    .select('id, title, created_at, is_ai_summarized')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch Note Count
  const { count: noteCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const fullName = profile?.full_name || user.email?.split('@')[0] || '사용자'
  const rawPlan = profile?.plan || 'free'
  const planType = rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1)
  const nextBillingAt: string | null = profile?.next_billing_at || null
  const nextBillingFormatted = nextBillingAt
    ? new Date(nextBillingAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const storageUsed = profile?.storage_bytes || 0
  const storageTotal = planType === 'Pro' ? 10 * 1024 * 1024 * 1024 : planType === 'Enterprise' ? 100 * 1024 * 1024 * 1024 : 1 * 1024 * 1024 * 1024
  const storagePercent = Math.min(Math.round((storageUsed / storageTotal) * 100), 100)
  const aiSummaryCount = profile?.ai_summary_count || 0
  const aiSummaryLimit = planType === 'Free' ? 100 : 1000

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111418] dark:text-white mb-2">안녕하세요, {fullName}님!</h2>
              <p className="text-[#617589] dark:text-gray-400">현재 <span className="font-semibold text-primary">{planType} 플랜</span>을 이용 중입니다</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Status Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">구독 현황</h3>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">{planType}</span>
                  <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">활성</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#617589] dark:text-gray-400">다음 결제일</span>
                    <span className="text-sm font-medium">
                      {nextBillingFormatted ?? (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#617589] dark:text-gray-400">월 결제 금액</span>
                    <span className="text-lg font-bold">₩{planType === 'Pro' ? '9,900' : planType === 'Enterprise' ? '29,900' : '0'}</span>
                  </div>
                </div>
                {planType !== 'Free' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-[#f0f2f4] dark:border-gray-800">
                    <button className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                      플랜 변경
                    </button>
                    <CancelSubscriptionButton nextBillingAt={nextBillingAt} />
                  </div>
                )}
              </div>
            </div>

            {/* Usage Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm flex flex-col h-full">
              <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800">
                <h3 className="font-bold text-lg">이번 달 사용량</h3>
              </div>
              <div className="p-6 flex flex-col justify-center flex-1 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">description</span>
                      <span className="font-medium text-[#111418] dark:text-gray-200">메모 개수</span>
                    </div>
                    <span className="text-[#617589] dark:text-gray-400">{noteCount || 0} / {planType === 'Free' ? '100' : '무제한'}</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: planType === 'Free' ? `${Math.min(((noteCount || 0) / 100) * 100, 100)}%` : '5%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">cloud_queue</span>
                      <span className="font-medium text-[#111418] dark:text-gray-200">저장공간</span>
                    </div>
                    <span className="text-[#617589] dark:text-gray-400">{(storageUsed / (1024 * 1024 * 1024)).toFixed(1)}GB / {storageTotal / (1024 * 1024 * 1024)}GB ({storagePercent}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${storagePercent}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">auto_awesome</span>
                      <span className="font-medium text-[#111418] dark:text-gray-200">AI 요약</span>
                    </div>
                    <span className="text-[#617589] dark:text-gray-400">{aiSummaryCount}회 / {aiSummaryLimit}회 ({Math.round(aiSummaryCount / aiSummaryLimit * 100)}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(aiSummaryCount / aiSummaryLimit * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm">
              <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">최근 활동</h3>
                <button className="text-primary text-sm font-medium hover:underline">전체 보기</button>
              </div>
              <div className="divide-y divide-[#f0f2f4] dark:divide-gray-800">
                {recentNotes && recentNotes.length > 0 ? recentNotes.map(note => (
                  <div key={note.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-[20px]">edit_note</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#111418] dark:text-white">메모: {note.title}</p>
                      <p className="text-xs text-[#617589] dark:text-gray-500 mt-0.5">{new Date(note.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-500">조회된 최근 내역이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
          <div className="h-8"></div>
        </div>
      </main>
    </>
  )
}
