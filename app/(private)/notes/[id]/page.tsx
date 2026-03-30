import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NoteEditor from './NoteEditor'

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !note) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <span className="material-symbols-outlined text-[64px] mb-4 text-slate-300">error</span>
        <p className="text-lg">노트를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return <NoteEditor initialNote={note} />
}
