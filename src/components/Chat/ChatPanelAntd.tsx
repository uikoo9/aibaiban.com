import { useRef, useEffect, useState } from 'react'
import { Button, Modal, theme, Avatar } from 'antd'
import { Bubble, Sender } from '@ant-design/x'
import {
  DeleteOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { LoginModalAntd } from '../Auth/LoginModalAntd'
import type { SimplifiedDiagram } from '@/types/diagram'

interface ChatPanelAntdProps {
  onDrawDiagram?: (diagram: SimplifiedDiagram) => void
}

export function ChatPanelAntd({ onDrawDiagram }: ChatPanelAntdProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ onDrawDiagram })
  const { isAuthenticated, user } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { token: themeToken } = theme.useToken() // 获取当前主题的 token

  // 自动滚动到底部
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (value: string) => {
    if (!value.trim() || isLoading) return

    // 检查登录状态
    if (!isAuthenticated) {
      setIsLoginModalOpen(true)
      return
    }

    setInputValue('')
    sendMessage(value)
  }

  const handleClear = () => {
    Modal.confirm({
      title: '清空对话',
      content: '确定要清空所有对话吗？此操作无法撤销。',
      okText: '清空',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        clearMessages()
      },
    })
  }

  // 转换消息格式为 antd-x 所需格式
  const bubbleItems = messages.map((msg) => {
    const isAssistant = msg.role === 'assistant'
    const isLastAssistantMessage = isAssistant && msg.id === messages[messages.length - 1]?.id
    const isTyping = isAssistant && isLoading && isLastAssistantMessage && msg.content.length > 0

    return {
      key: msg.id,
      role: msg.role,
      content: msg.content,
      variant: (msg.role === 'user' ? 'filled' : 'outlined') as 'filled' | 'outlined',
      placement: (msg.role === 'user' ? 'end' : 'start') as 'end' | 'start',
      avatar: msg.role === 'user'
        ? <Avatar style={{ background: themeToken.colorPrimary }} icon={<UserOutlined />} />
        : <Avatar style={{ background: themeToken.colorPrimary }} icon={<RobotOutlined />} />,
      loading: isAssistant && isLoading && isLastAssistantMessage && msg.content.length === 0,
      typing: isTyping,
      styles: {
        content: msg.role === 'user'
          ? { background: themeToken.colorPrimary, color: '#fff' }
          : { background: themeToken.colorBgContainer, color: themeToken.colorText },
      },
    }
  })

  return (
    <>
      {/* 标题栏 */}
      <div
        style={{
          height: 64,
          borderBottom: `1px solid ${themeToken.colorBorder}`,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: themeToken.colorBgContainer,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(22, 119, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RobotOutlined style={{ fontSize: 20, color: themeToken.colorPrimary }} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16, color: themeToken.colorText }}>
              AI 助手
            </div>
            {isAuthenticated && user && (
              <div style={{ fontSize: 12, color: themeToken.colorTextSecondary }}>
                {user.nickname || user.phone}
              </div>
            )}
          </div>
        </div>
        {messages.length > 1 && (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleClear}
            title="清空对话"
          />
        )}
      </div>

      {/* 消息列表 */}
      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
        <Bubble.List items={bubbleItems} />
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div
        style={{
          borderTop: `1px solid ${themeToken.colorBorder}`,
          padding: 16,
          background: themeToken.colorBgContainer,
        }}
      >
        <Sender
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          loading={isLoading}
          placeholder="输入你的需求..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          submitType="enter"
          style={{
            height: 160,
          }}
        />
      </div>

      {/* 登录弹窗 */}
      <LoginModalAntd open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
