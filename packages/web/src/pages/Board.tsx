function Board() {
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* 顶部导航栏 */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center">
        <div className="flex-1 flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">AI白板</h1>
          <input
            type="text"
            placeholder="未命名白板"
            className="px-3 py-1 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            分享
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* 主白板区域 */}
        <div className="flex-1 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>白板区域</p>
            <p className="text-sm mt-2">Excalidraw 即将集成...</p>
          </div>
        </div>

        {/* 右侧 AI 助手面板 */}
        <aside className="w-80 bg-card border-l border-border flex flex-col">
          <div className="h-14 border-b border-border px-4 flex items-center">
            <h2 className="font-semibold text-foreground">AI 助手</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-muted-foreground">
              <p>AI 聊天功能即将上线...</p>
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <input
              type="text"
              placeholder="输入你的需求..."
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Board
