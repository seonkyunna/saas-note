import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import NewNoteModal from './NewNoteModal'

export default async function NotesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if user has a paid plan
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    redirect('/payment')
  }

  // Fetch Notes for Sidebar
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-[#f3f4f6] text-slate-900 font-display antialiased overflow-hidden h-full flex-1 flex flex-col">
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-[30%] min-w-[300px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full z-10">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-slate-800">내 노트</h2>
            <NewNoteModal />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notes && notes.length > 0 ? notes.map(note => (
              <Link key={note.id} href={`/notes/${note.id}`} className="group cursor-pointer p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors block">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 truncate pr-2">{note.title}</h3>
                  <span className="text-xs text-slate-400 shrink-0">{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            )) : (
              <div className="p-4 text-center text-sm text-gray-500">노트가 없습니다.</div>
            )}
          </div>
        </aside>
        
        <section className="flex-1 bg-[#f3f4f6] overflow-y-auto h-full relative">
          {children}
        </section>
      </main>
    </div>
  )
}
