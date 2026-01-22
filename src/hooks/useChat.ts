import { useState, useEffect, useCallback, useRef } from 'react'
import type { Message, ChatState } from '@/types/chat'
import { useAuth } from '@/hooks/useAuth'

const STORAGE_KEY = 'chat-history'

// 拒绝话术模板（多个随机选择）
const REJECT_MESSAGES = [
  `抱歉，我是 AI 白板绘图助手，只能帮你绘制图表、流程图、架构图等。

我可以帮你：
• 绘制流程图和架构图
• 设计系统结构图
• 创建思维导图和关系图
• 可视化各种概念和流程

试试这样说：
「画一个用户登录流程图」
「设计一个微服务架构」
「画三个矩形连接起来」`,

  `你好！我是专注于绘图的 AI 助手，主要帮助你可视化各种想法和概念。

我擅长：
• 流程图：展示业务流程和操作步骤
• 架构图：设计系统结构和技术架构
• 关系图：表达实体之间的关联
• 思维导图：组织和展示复杂信息

如果你有想要可视化的内容，可以告诉我，比如：
「帮我画一个电商系统的架构」
「设计一个项目管理流程图」`,

  `很抱歉，我的专长是绘制各种图表和图形，暂时无法回答其他问题。

不过，如果你想把问题转化为图表展示，我很乐意帮忙！

例如：
• 想了解概念？可以画思维导图
• 想理解流程？可以画流程图
• 想看系统结构？可以画架构图

你可以试试：
「用思维导图展示 XXX 的概念」
「画一个 XXX 的流程」
「设计 XXX 的架构图」`,

  `嗨！我是白板绘图助手，专门帮你把想法变成可视化图表。

我能做什么？
✓ 绘制各类流程图（登录、支付、审批等）
✓ 设计技术架构图（微服务、前后端、数据库）
✓ 创建组织结构图和关系图
✓ 制作思维导图和概念图

给我一个绘图任务吧，比如：
「画出用户注册的完整流程」
「设计一个博客系统的架构」
「用图表展示公司组织架构」`,
]

/**
 * 随机选择一个拒绝话术
 */
function getRandomRejectMessage(): string {
  const index = Math.floor(Math.random() * REJECT_MESSAGES.length)
  return REJECT_MESSAGES[index]
}

/**
 * 流式显示文本（逐字显示效果）
 */
async function streamText(
  text: string,
  messageId: string,
  setState: React.Dispatch<React.SetStateAction<ChatState>>,
  saveMessages: (messages: Message[]) => void
) {
  const delay = 20 // 每个字符延迟 20ms

  for (let i = 0; i <= text.length; i++) {
    const chunk = text.slice(0, i)

    // 使用 setTimeout 包装成异步操作
    await new Promise((resolve) => setTimeout(resolve, delay))

    setState((prev) => {
      const updatedMessages = prev.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: chunk } : msg
      )
      saveMessages(updatedMessages)
      return { ...prev, messages: updatedMessages }
    })
  }
}

export function useChat() {
  const { isAuthenticated } = useAuth()
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

  // 监听登录状态变化，退出登录时清空消息
  // 注意：使用 ref 来跟踪上一次的认证状态，避免页面刷新时误清空
  const prevAuthRef = useRef<boolean | null>(null)

  useEffect(() => {
    // 只在从已登录变为未登录时清空（真正的退出登录）
    if (prevAuthRef.current === true && !isAuthenticated) {
      setState({
        messages: [],
        isLoading: false,
        error: null,
      })
      localStorage.removeItem(STORAGE_KEY)
    }
    prevAuthRef.current = isAuthenticated
  }, [isAuthenticated])

  // 保存消息到 localStorage
  const saveMessages = useCallback((messages: Message[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [])

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // 获取用户认证信息
    const authData = localStorage.getItem('auth-user')
    if (!authData) {
      setState((prev) => ({
        ...prev,
        error: '请先登录',
      }))
      return
    }

    let userId: string
    let userToken: string
    try {
      const user = JSON.parse(authData)
      userId = user.id
      userToken = user.token
    } catch (error) {
      console.error('Failed to parse auth data:', error)
      setState((prev) => ({
        ...prev,
        error: '认证信息无效，请重新登录',
      }))
      return
    }

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
      return { ...prev, messages: newMessages }
    })

    // 准备 AI 消息 ID（但不立即添加到消息列表）
    const aiMessageId = (Date.now() + 1).toString()

    try {
      // 显示加载状态
      setState((prev) => ({ ...prev, isLoading: true }))

      // 调用非流式 AI API
      const response = await fetch('https://aibaiban.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId,
          'usertoken': userToken,
        },
        body: JSON.stringify({
          userPrompt: encodeURIComponent(content.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 解析 JSON 响应
      const data = await response.json()
      console.log('API 响应:', data)

      // 检查响应类型
      if (data.type === 'success' && data.obj) {
        const { intent, reason } = data.obj

        // 创建 AI 消息（初始为空，用于流式显示）
        const aiMessage: Message = {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        }

        // 先添加空消息到列表
        setState((prev) => {
          const newMessages = [...prev.messages, aiMessage]
          saveMessages(newMessages)
          return { ...prev, messages: newMessages, isLoading: true }
        })

        if (intent === 'REJECT') {
          // 非绘图意图，使用预设话术并流式显示
          console.log('检测到非绘图意图，原因:', reason)
          const rejectMessage = getRandomRejectMessage()

          // 流式显示拒绝话术
          await streamText(rejectMessage, aiMessageId, setState, saveMessages)

          // 关闭加载状态
          setState((prev) => ({ ...prev, isLoading: false }))
        } else if (intent === 'DRAW') {
          // 绘图意图，显示后端返回的设计说明
          console.log('检测到绘图意图')
          const drawMessage = data.obj.content || data.obj.message || '正在为你设计图表...'

          // 流式显示设计说明
          await streamText(drawMessage, aiMessageId, setState, saveMessages)

          // 关闭加载状态
          setState((prev) => ({ ...prev, isLoading: false }))
        } else {
          // 未知意图，显示原始响应
          setState((prev) => {
            const updatedMessages = prev.messages.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: JSON.stringify(data, null, 2) }
                : msg
            )
            saveMessages(updatedMessages)
            return { ...prev, messages: updatedMessages, isLoading: false }
          })
        }
      } else {
        // 响应格式不符合预期
        throw new Error(data.msg || '响应格式错误')
      }
    } catch (error) {
      console.error('Failed to send message:', error)

      // 创建错误消息
      const errorMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '抱歉，发生了错误，请稍后重试。',
        timestamp: Date.now(),
      }

      setState((prev) => {
        const newMessages = [...prev.messages, errorMessage]
        saveMessages(newMessages)
        return {
          ...prev,
          messages: newMessages,
          isLoading: false,
          error: error instanceof Error ? error.message : '未知错误',
        }
      })
    }
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
