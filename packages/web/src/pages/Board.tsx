import { ThemeSwitcher } from '@/components/ThemeSwitcher'

function Board() {
  return (
    <div className="h-screen bg-base-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="h-14 border-b border-base-300 bg-base-200 px-4 flex items-center">
        <div className="flex-1 flex items-center gap-4">
          <h1 className="text-lg font-semibold text-base-content">AI白板</h1>
          <input
            type="text"
            placeholder="未命名白板"
            className="input input-sm input-ghost"
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button className="btn btn-primary btn-sm">
            分享
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* 主白板区域 */}
        <div className="flex-1 bg-base-200 flex items-center justify-center">
          <div className="text-center text-base-content/60">
            <p>白板区域</p>
            <p className="text-sm mt-2">Excalidraw 即将集成...</p>
          </div>
        </div>

        {/* 右侧 AI 助手面板 */}
        <aside className="w-80 bg-base-100 border-l border-base-300 flex flex-col">
          <div className="h-14 border-b border-base-300 px-4 flex items-center">
            <h2 className="font-semibold text-base-content">AI 助手</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-base-content/60">
              <p>AI 聊天功能即将上线...</p>
            </div>
          </div>
          <div className="p-4 border-t border-base-300">
            <input
              type="text"
              placeholder="输入你的需求..."
              className="input input-sm w-full"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Board
