import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="text-center my-3">
        <span className="text-xs text-base-content/60 bg-base-200 px-4 py-2 rounded-full">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar placeholder">
        <div className="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
          <span className="text-xs font-medium">{isUser ? '我' : 'AI'}</span>
        </div>
      </div>
      <div className={`chat-bubble text-sm ${isUser ? 'chat-bubble-primary' : ''}`}>
        {message.content ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <span className="loading loading-dots loading-sm"></span>
        )}
      </div>
      <div className="chat-footer opacity-60 text-xs mt-1">
        {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
