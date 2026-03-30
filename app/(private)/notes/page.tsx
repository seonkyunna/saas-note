import Icon from '@/components/Icon'

export default function NotesIndexPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#f3f4f6] dark:bg-background-dark">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
          <Icon name="edit_document" className="text-3xl text-gray-400 dark:text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">선택된 노트가 없습니다</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">사이드바에서 노트를 선택하거나 새 노트를 작성해주세요.</p>
        </div>
      </div>
    </div>
  )
}
