import { useRef, useEffect, useState } from 'react'
import { Send, Trash2, LogOut } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { MessageBubble } from './MessageBubble'
import { LoginModal } from '../Auth/LoginModal'

export function ChatPanel() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat()
  const { isAuthenticated, user, logout } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    // 检查登录状态
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    await sendMessage(inputValue)
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    if (messages.length === 0) return
    if (confirm('确定要清空所有对话吗？')) {
      clearMessages()
    }
  }

  return (
    <>
      {/* 标题栏 */}
      <div className="h-14 border-b border-base-300 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base-content">AI 助手</h2>
          {isAuthenticated && user && (
            <span className="text-xs text-base-content/60">
              {user.nickname || user.phone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="btn btn-ghost btn-xs btn-circle"
              title="清空对话"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-xs btn-circle"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-base-content/60">
              <p className="text-sm">👋 你好！我是 AI 助手</p>
              <p className="text-xs mt-2">有什么可以帮你的吗？</p>
              {!isAuthenticated && (
                <p className="text-xs mt-4 text-primary font-medium">
                  💡 发送消息前需要先登录
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-image avatar placeholder">
                  <div className="w-8 rounded-full bg-neutral text-neutral-content">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                <div className="chat-bubble">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-base-300">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="输入你的需求..."
            className="input input-sm input-bordered flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="btn btn-primary btn-sm btn-square"
            title="发送"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-base-content/50 mt-2">
          {isAuthenticated ? (
            '按 Enter 发送，Shift + Enter 换行'
          ) : (
            <span className="text-primary font-medium">点击发送按钮登录后使用 AI 助手</span>
          )}
        </div>
      </div>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
