import { useRef, useEffect, useState } from 'react'
import { Send, Trash2, X } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { MessageBubble } from './MessageBubble'
import { LoginModal } from '../Auth/LoginModal'

export function ChatPanel() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat()
  const { isAuthenticated, user } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 自动调整 textarea 高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    if (messages.length === 0) return
    setIsClearConfirmOpen(true)
  }

  const confirmClear = () => {
    clearMessages()
    setIsClearConfirmOpen(false)
  }

  const handleClearInput = () => {
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <>
      {/* 标题栏 */}
      <div className="h-16 border-b border-base-300 bg-gradient-to-b from-base-100 to-base-200 px-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-base-content">AI 助手</h2>
            {isAuthenticated && user && (
              <p className="text-xs text-base-content/60">
                {user.nickname || user.phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="btn btn-ghost btn-sm btn-circle"
              title="清空对话"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-base font-semibold text-base-content mb-2">
                你好！我是 AI 助手
              </p>
              <p className="text-sm text-base-content/60 mb-4">
                有什么可以帮你的吗？
              </p>
              {!isAuthenticated && (
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    💡 发送消息前需要先登录
                  </p>
                </div>
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
                  <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    <span className="text-xs font-medium">AI</span>
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
      <div className="p-5 border-t border-base-300 bg-base-100">
        <div className="relative">
          <textarea
            ref={inputRef}
            placeholder="输入你的需求..."
            className="textarea textarea-bordered w-full text-base resize-none min-h-[88px] max-h-[200px] pr-24 pb-12"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            rows={3}
          />
          {inputValue && (
            <button
              onClick={handleClearInput}
              className="absolute right-2 top-2 btn btn-ghost btn-xs btn-circle"
              title="清空输入"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 bottom-2 btn btn-primary btn-sm gap-1 shadow-md shadow-primary/20"
            title="发送 (Enter)"
          >
            <Send className="w-4 h-4" />
            <span className="text-xs">发送</span>
          </button>
        </div>
      </div>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* 清空确认弹窗 */}
      {isClearConfirmOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">清空对话</h3>
            <p className="text-base-content/80 mb-6">
              确定要清空所有对话吗？此操作无法撤销。
            </p>
            <div className="modal-action">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button
                onClick={confirmClear}
                className="btn btn-error"
              >
                清空
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsClearConfirmOpen(false)}></div>
        </div>
      )}
    </>
  )
}
