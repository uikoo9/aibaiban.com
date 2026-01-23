import { useState, useEffect } from 'react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { User, LogOut, Github, GripVertical, Sparkles, Send, Palette } from 'lucide-react'

const MIN_CHAT_WIDTH = 280
const MAX_CHAT_WIDTH = 600
const DEFAULT_CHAT_WIDTH = 380

export default function Demo() {
  // 聊天面板宽度状态
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [message, setMessage] = useState('')

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
      {/* ========== Header 区域 ========== */}
      <header className="h-16 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200 px-6 flex items-center justify-between relative z-50 shadow-sm">
        {/* Logo 和品牌 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group hover:bg-primary/20 transition-colors">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-content font-bold text-xs">
              AI
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-base-content">UI/UX Pro Max Demo</h1>
            <p className="text-xs text-base-content/60 hidden sm:block">专业级用户体验展示</p>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {/* AI 生成按钮 - 主要 CTA */}
          <button
            className="btn btn-primary gap-2 h-10 min-h-10 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            aria-label="AI 生成图表"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-semibold">AI 生成</span>
          </button>

          {/* 用户菜单下拉 */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost gap-2 h-10 min-h-10 hover:bg-base-200"
              aria-label="用户菜单"
            >
              <div className="avatar placeholder">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center ring-2 ring-primary/10">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <span className="hidden sm:inline text-sm font-medium">138****8888</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 p-2 shadow-xl border border-base-300 mt-3"
            >
              <li>
                <button className="gap-2 text-base-content hover:bg-base-200">
                  <User className="w-4 h-4" />
                  <span>个人信息</span>
                </button>
              </li>
              <li>
                <button className="text-error gap-2 hover:bg-error/10">
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 主题切换器 */}
          <ThemeSwitcher />

          {/* GitHub 链接 */}
          <a
            href="https://github.com/uikoo9/aibaiban.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost gap-2 h-10 min-h-10 hover:bg-base-200"
            aria-label="查看 GitHub 仓库"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">GitHub</span>
          </a>
        </div>
      </header>

      {/* ========== 主内容区域 ========== */}
      <div className="flex-1 flex min-h-0">
        {/* 白板区域 */}
        <div className="flex-1 bg-base-200 relative overflow-hidden">
          {/* 白板工具栏 */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-2 flex gap-1">
              <button className="btn btn-sm btn-square btn-ghost" title="选择工具">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </button>
              <button className="btn btn-sm btn-square btn-ghost" title="矩形">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                </svg>
              </button>
              <button className="btn btn-sm btn-square btn-ghost" title="圆形">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                </svg>
              </button>
              <button className="btn btn-sm btn-square btn-ghost" title="箭头">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="btn btn-sm btn-square btn-ghost" title="文字">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>

            <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-2 flex gap-1">
              <button className="btn btn-sm btn-square btn-ghost" title="撤销">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button className="btn btn-sm btn-square btn-ghost" title="重做">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* 白板画布占位 */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mb-4">
                <Palette className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-base-content">白板区域</h2>
              <p className="text-base-content/60 max-w-md">
                这里是 Excalidraw 白板组件的展示区域
                <br />
                支持绘制图表、流程图、架构图等
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button className="btn btn-primary gap-2">
                  <Sparkles className="w-4 h-4" />
                  开始创作
                </button>
                <button className="btn btn-outline gap-2">
                  查看示例
                </button>
              </div>
            </div>
          </div>

          {/* 缩放控制 */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-2 flex gap-1">
              <button className="btn btn-sm btn-square btn-ghost" title="缩小">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="btn btn-sm btn-ghost no-animation pointer-events-none min-w-[60px]">100%</span>
              <button className="btn btn-sm btn-square btn-ghost" title="放大">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
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

        {/* ========== AI 聊天面板 ========== */}
        <aside
          className="flex flex-col overflow-hidden bg-base-100 border-l border-base-300 relative z-10"
          style={{ width: `${chatWidth}px` }}
        >
          {/* 聊天面板头部 */}
          <div className="h-14 px-4 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-base-content">AI 助手</h3>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  在线
                </p>
              </div>
            </div>
            <button className="btn btn-sm btn-ghost btn-square" title="更多选项">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* 聊天消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 欢迎消息 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-base-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <p className="text-sm text-base-content leading-relaxed">
                    你好！我是 AI 绘图助手 👋
                    <br /><br />
                    我可以帮你：
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-base-content/80">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>绘制流程图、架构图、思维导图</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>生成 UML 类图、时序图</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>可视化数据关系和业务逻辑</span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-base-content/40 mt-1 ml-1">刚刚</p>
              </div>
            </div>

            {/* 示例用户消息 */}
            <div className="flex gap-3 justify-end">
              <div className="flex-1 flex flex-col items-end">
                <div className="bg-primary text-primary-content rounded-2xl rounded-tr-sm px-4 py-3 shadow-md shadow-primary/20 max-w-[85%]">
                  <p className="text-sm leading-relaxed">
                    帮我画一个电商系统的架构图
                  </p>
                </div>
                <p className="text-xs text-base-content/40 mt-1 mr-1">1分钟前</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 ring-2 ring-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* AI 响应消息 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-base-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <p className="text-sm text-base-content leading-relaxed">
                    好的！我正在为你生成电商系统架构图... ✨
                  </p>
                  <div className="mt-3 p-3 bg-base-100 rounded-lg border border-base-300">
                    <p className="text-xs text-base-content/60 mb-2">包含以下模块：</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-primary badge-sm">用户服务</span>
                      <span className="badge badge-secondary badge-sm">商品服务</span>
                      <span className="badge badge-accent badge-sm">订单服务</span>
                      <span className="badge badge-info badge-sm">支付服务</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-base-content/40 mt-1 ml-1">30秒前</p>
              </div>
            </div>

            {/* 加载状态示例 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="bg-base-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="loading loading-dots loading-sm text-primary"></span>
                    <span className="text-sm text-base-content/60">正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="border-t border-base-300 p-4 bg-base-100 shrink-0">
            {/* 快捷提示 */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              <button className="btn btn-xs btn-outline whitespace-nowrap">画流程图</button>
              <button className="btn btn-xs btn-outline whitespace-nowrap">画架构图</button>
              <button className="btn btn-xs btn-outline whitespace-nowrap">画思维导图</button>
            </div>

            {/* 输入框 */}
            <div className="join w-full">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="描述你想画的图表..."
                className="input input-bordered join-item flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    console.log('发送消息:', message)
                  }
                }}
              />
              <button
                className="btn btn-primary join-item gap-2 shadow-md shadow-primary/20"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-base-content/40 mt-2 text-center">
              按 Enter 发送，Shift + Enter 换行
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
