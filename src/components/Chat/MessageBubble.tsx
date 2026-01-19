import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="text-center my-2">
        <span className="text-xs text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar placeholder">
        <div className="w-8 rounded-full bg-neutral text-neutral-content">
          <span className="text-xs">{isUser ? '我' : 'AI'}</span>
        </div>
      </div>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-primary' : ''}`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
      <div className="chat-footer opacity-50 text-xs mt-1">
        {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
