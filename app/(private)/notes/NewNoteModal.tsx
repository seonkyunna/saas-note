'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewNoteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('선택 안함')
  const [content, setContent] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    if (!title) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase.from('notes').insert({
      title,
      category,
      content,
      user_id: user.id
    }).select().single()

    if (!error && data) {
      setIsOpen(false)
      setTitle('')
      setContent('')
      router.push(`/notes/${data.id}`)
      router.refresh()
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        새 노트
      </button>

      {isOpen && (
        <div aria-labelledby="modal-title" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto" role="dialog">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0 z-10 relative pointer-events-none">
            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
              <div className="bg-white px-4 py-5 sm:p-6 pb-0">
                <h3 className="text-lg font-bold leading-6 text-gray-900" id="modal-title">새로운 기록 남기기</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">아이디어를 기록하고 분류하여 관리하세요.</p>
                </div>
              </div>
              <div className="px-4 py-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">제목</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border placeholder-gray-400" id="title" name="title" placeholder="노트 제목을 입력하세요" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">카테고리</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border bg-white" id="category" name="category">
                    <option>선택 안함</option>
                    <option>업무</option>
                    <option>개인</option>
                    <option>아이디어</option>
                    <option>공부</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">내용</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border placeholder-gray-400 resize-none" id="content" name="content" placeholder="내용을 자유롭게 작성하세요..." rows={6}></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark sm:ml-3 sm:w-auto transition-colors" onClick={handleSave} type="button">
                  저장하기
                </button>
                <button className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors" onClick={() => setIsOpen(false)} type="button">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
