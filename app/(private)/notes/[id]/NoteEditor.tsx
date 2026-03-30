'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Note = {
  id: string
  title: string
  content: string
  category: string | null
  created_at: string
}

export default function NoteEditor({ initialNote }: { initialNote: Note }) {
  const [title, setTitle] = useState(initialNote.title || '')
  const [content, setContent] = useState(initialNote.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Only save if changed
    if (title === initialNote.title && content === initialNote.content) return

    setIsSaving(true)
    const timer = setTimeout(async () => {
      await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', initialNote.id)
      
      setIsSaving(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, content, initialNote.id, initialNote.title, initialNote.content, supabase])

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    await supabase.from('notes').delete().eq('id', initialNote.id)
    router.push('/dashboard')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full p-8 relative max-w-4xl mx-auto my-4 md:my-8 h-[calc(100%-2rem)]">
      <div className="absolute top-4 right-6 text-xs text-gray-400">
        {isSaving ? '저장 중...' : '저장됨'}
      </div>
      
      <div className="border-b border-gray-100 pb-6 mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
            {initialNote.category || '분류 없음'}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {new Date(initialNote.created_at).toLocaleString('ko-KR')}
          </span>
          <div className="ml-auto">
            <button 
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" 
              title="삭제"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>
        <input 
          className="w-full text-3xl font-bold text-slate-900 leading-tight border-none p-0 focus:ring-0 placeholder-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 없는 노트"
        />
      </div>
      <div className="prose max-w-none h-full">
        <textarea 
          className="w-full h-full min-h-[500px] text-slate-700 leading-relaxed border-none p-0 focus:ring-0 resize-none bg-transparent placeholder-gray-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기에 메모를 작성하세요..."
        />
      </div>
    </div>
  )
}
