import { Suspense, lazy, useState, useRef, useEffect } from 'react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ChatPanel } from '@/components/Chat/ChatPanel'
import { LoginModal } from '@/components/Auth/LoginModal'
import { useAuth } from '@/hooks/useAuth'
import { User, LogOut, Github, GripVertical, Sparkles } from 'lucide-react'
import type { WhiteboardHandle } from '@/components/Whiteboard'
import type { SimplifiedDiagram } from '@/types/diagram'

const Whiteboard = lazy(() => import('@/components/Whiteboard').then(m => ({ default: m.Whiteboard })))

const MIN_CHAT_WIDTH = 280
const MAX_CHAT_WIDTH = 600
const DEFAULT_CHAT_WIDTH = 320
const CHAT_WIDTH_STORAGE_KEY = 'chat-panel-width'

function Board() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const whiteboardRef = useRef<WhiteboardHandle>(null)

  // 聊天面板宽度状态
  const [chatWidth, setChatWidth] = useState(() => {
    const saved = localStorage.getItem(CHAT_WIDTH_STORAGE_KEY)
    return saved ? Number(saved) : DEFAULT_CHAT_WIDTH
  })
  const [isResizing, setIsResizing] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)

  // 模拟大模型返回的架构图数据
  const mockAIResponse: SimplifiedDiagram = {
    type: 'architecture',
    title: 'App 架构图',
    nodes: [
      {
        id: 'frontend',
        label: '前端层\nReact + Vite',
        type: 'rectangle',
        color: 'blue',
      },
      {
        id: 'backend',
        label: '后端服务\nNode.js API',
        type: 'rectangle',
        color: 'green',
      },
      {
        id: 'database',
        label: '数据库\nPostgreSQL',
        type: 'ellipse',
        color: 'purple',
      },
      {
        id: 'cache',
        label: '缓存层\nRedis',
        type: 'diamond',
        color: 'orange',
      },
      {
        id: 'cdn',
        label: 'CDN\n静态资源',
        type: 'ellipse',
        color: 'red',
      },
    ],
    connections: [
      { from: 'frontend', to: 'backend', label: 'HTTPS' },
      { from: 'frontend', to: 'cdn', label: 'Assets' },
      { from: 'backend', to: 'database', label: 'SQL' },
      { from: 'backend', to: 'cache', label: 'Cache' },
    ],
  }

  // 处理 AI 生成图表
  const handleGenerateAIDiagram = () => {
    setShowAIModal(true)
  }

  // 确认生成
  const confirmGenerate = () => {
    whiteboardRef.current?.addAIGeneratedDiagram(mockAIResponse)
    setShowAIModal(false)
  }

  // 测试按钮（旧功能，保留）
  // const handleAddRandomShape = () => {
  //   whiteboardRef.current?.addRandomShape()
  // }

  // 处理 AI 生成的图表（从聊天区域调用）
  const handleDrawDiagram = (diagram: SimplifiedDiagram) => {
    console.log('📊 收到图表数据，准备渲染到白板:', diagram)
    whiteboardRef.current?.addAIGeneratedDiagram(diagram)
  }

  // 保存宽度到 LocalStorage
  useEffect(() => {
    localStorage.setItem(CHAT_WIDTH_STORAGE_KEY, String(chatWidth))
  }, [chatWidth])

  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  // 处理拖动中
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX
      const clampedWidth = Math.max(MIN_CHAT_WIDTH, Math.min(MAX_CHAT_WIDTH, newWidth))
      setChatWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // 拖动时禁用选择文本
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing])

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
          {/* AI 生成图表按钮 */}
          <button
            onClick={handleGenerateAIDiagram}
            className="btn btn-ghost gap-2 h-10 min-h-10"
            aria-label="AI 生成图���"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">AI 生成</span>
          </button>

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

          {/* GitHub 链接 */}
          <a
            href="https://github.com/uikoo9/aibaiban.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost gap-2 h-10 min-h-10"
            aria-label="查看 GitHub 仓库"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">GitHub</span>
          </a>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
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

        {/* 可拖动分隔条 */}
        <div
          className={`w-1 bg-base-300 hover:bg-primary hover:w-1.5 transition-all cursor-col-resize flex items-center justify-center group relative z-20 ${
            isResizing ? 'bg-primary w-1.5' : ''
          }`}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="调整聊天面板宽度"
        >
          {/* 拖动手柄 */}
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <div className={`rounded-full bg-base-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
              isResizing ? 'opacity-100 bg-primary text-primary-content' : ''
            }`}>
              <GripVertical className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 右侧 AI 助手面板 */}
        <aside
          className="flex flex-col overflow-hidden bg-base-100 border-l border-base-300 relative z-10"
          style={{ width: `${chatWidth}px` }}
        >
          <ChatPanel onDrawDiagram={handleDrawDiagram} />
        </aside>
      </div>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* AI 生成图表模态框 */}
      {showAIModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">模拟大模型返回内容</h3>
            <p className="text-sm text-base-content/60 mb-4">
              以下是大模型返回的简化图表格式，点击"生成图表"将转换为白板内容
            </p>

            {/* 显示 JSON 内容 */}
            <div className="mockup-code mb-6">
              <pre className="px-6 py-4">
                <code className="text-sm">{JSON.stringify(mockAIResponse, null, 2)}</code>
              </pre>
            </div>

            <div className="alert alert-info mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="text-sm">
                <p className="font-semibold mb-1">说明：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>大模型输出简化的 JSON 格式（nodes + connections）</li>
                  <li>前端转换器自动转换为 Excalidraw 元素</li>
                  <li>支持自动布局、颜色映射、箭头连接</li>
                </ul>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowAIModal(false)}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button
                onClick={confirmGenerate}
                className="btn btn-primary gap-2"
              >
                <Sparkles className="w-4 h-4" />
                生成图表
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAIModal(false)}></div>
        </div>
      )}
    </div>
  )
}

export default Board
