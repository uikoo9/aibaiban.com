import { Suspense, lazy, useState, useRef } from 'react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ChatPanel } from '@/components/Chat/ChatPanel'
import { LoginModal } from '@/components/Auth/LoginModal'
import { useAuth } from '@/hooks/useAuth'
import { User, LogOut, Shapes } from 'lucide-react'
import type { WhiteboardHandle } from '@/components/Whiteboard'

const Whiteboard = lazy(() => import('@/components/Whiteboard').then(m => ({ default: m.Whiteboard })))

function Board() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const whiteboardRef = useRef<WhiteboardHandle>(null)

  const handleAddRandomShape = () => {
    whiteboardRef.current?.addRandomShape()
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="h-16 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200 px-6 flex items-center justify-between relative z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="AI白板" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">AI 白板</h1>
            <p className="text-xs text-base-content/60 hidden sm:block">aibaiban.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 测试按钮 - 添加随机形状 (暂时隐藏) */}
          {/* <button
            onClick={handleAddRandomShape}
            className="btn btn-ghost gap-2 h-10 min-h-10"
            aria-label="添加随机形状"
          >
            <Shapes className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">测试形状</span>
          </button> */}

          {/* 登录/用户信息 */}
          {isAuthenticated && user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost gap-2 h-10 min-h-10"
                aria-label="用户菜单"
              >
                <div className="avatar placeholder">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user.phone}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 p-2 shadow-xl border border-base-300 mt-3"
              >
                <li>
                  <button onClick={logout} className="text-error gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="btn btn-primary gap-2 h-10 min-h-10 shadow-md shadow-primary/20"
              aria-label="登录"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">登录</span>
            </button>
          )}

          <ThemeSwitcher />
        </div>
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
            <Whiteboard ref={whiteboardRef} />
          </Suspense>
        </div>

        {/* 右侧 AI 助手面板 */}
        <aside className="w-80 bg-base-100 border-l border-base-300 flex flex-col relative z-10">
          <ChatPanel />
        </aside>
      </div>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}

export default Board
