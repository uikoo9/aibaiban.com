import { useState, useEffect, useCallback } from 'react'
import type { Message, ChatState } from '@/types/chat'

const STORAGE_KEY = 'chat-history'

// Mock AI 回复列表
const MOCK_REPLIES = [
  '我是 AI 白板助手，很高兴为你服务！有什么我可以帮你的吗？',
  '这是一个很好的问题！让我来帮你分析一下...',
  '我理解了，你想要实现这个功能。我建议...',
  '根据你的描述，我有以下几点建议：\n1. 首先...\n2. 然后...\n3. 最后...',
  '好的，我明白你的意思了。让我们一步步来处理。',
  '这个想法不错！我们可以这样做...',
  '让我帮你整理一下思路...',
  '我注意到你的白板内容，基于此我建议...',
]

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  // 加载历史消息
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        const messages = JSON.parse(savedHistory)
        setState((prev) => ({ ...prev, messages }))
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
  }, [])

  // 保存消息到 localStorage
  const saveMessages = useCallback((messages: Message[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [])

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    // 添加用户消息
    setState((prev) => {
      const newMessages = [...prev.messages, userMessage]
      saveMessages(newMessages)
      return { ...prev, messages: newMessages, isLoading: true }
    })

    // Mock AI 回复（延迟 1-2 秒）
    const delay = 1000 + Math.random() * 1000
    await new Promise((resolve) => setTimeout(resolve, delay))

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)],
      timestamp: Date.now(),
    }

    setState((prev) => {
      const newMessages = [...prev.messages, aiMessage]
      saveMessages(newMessages)
      return { ...prev, messages: newMessages, isLoading: false }
    })
  }, [saveMessages])

  // 清空对话
  const clearMessages = useCallback(() => {
    setState({ messages: [], isLoading: false, error: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearMessages,
  }
}
