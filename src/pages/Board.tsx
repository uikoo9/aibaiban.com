import { Suspense, lazy } from 'react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ChatPanel } from '@/components/Chat/ChatPanel'

const Whiteboard = lazy(() => import('@/components/Whiteboard').then(m => ({ default: m.Whiteboard })))

function Board() {
  return (
    <div className="h-screen bg-base-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="h-14 border-b border-base-300 bg-base-200 px-4 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="AI白板" className="h-8 w-8" />
          <h1 className="text-lg font-semibold text-base-content">aibaiban.com</h1>
        </div>
        <ThemeSwitcher />
      </header>

      <div className="flex-1 flex">
        {/* 主白板区域 */}
        <div className="flex-1 bg-base-200 relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <Whiteboard />
          </Suspense>
        </div>

        {/* 右侧 AI 助手面板 */}
        <aside className="w-80 bg-base-100 border-l border-base-300 flex flex-col relative z-10">
          <ChatPanel />
        </aside>
      </div>
    </div>
  )
}

export default Board
