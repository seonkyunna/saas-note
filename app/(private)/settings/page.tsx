import Icon from '@/components/Icon'

export default function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col p-8 bg-background-light dark:bg-background-dark">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">설정</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">계정 정보 및 앱 설정을 관리하세요.</p>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-20 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col items-center gap-3 text-center">
            <Icon name="construction" className="text-4xl text-gray-400" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-gray-300">준비 중인 기능입니다</h3>
            <p className="text-sm text-slate-500">설정 페이지는 현재 개발 준비 중입니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
