import { useRef, useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { Bubble, Sender, Welcome, Prompts } from '@ant-design/x'
import {
  DeleteOutlined,
  RobotOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BulbOutlined,
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

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    if (messages.length === 0) return

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
  const bubbleItems = messages.map((msg) => ({
    key: msg.id,
    content: msg.content,
    role: msg.role,
    loading: msg.role === 'assistant' && isLoading && msg.id === messages[messages.length - 1]?.id,
  }))

  // 快速提示词
  const promptItems = [
    {
      key: '1',
      label: '生成流程图',
      icon: <FileTextOutlined />,
      description: '根据描述生成流程图',
    },
    {
      key: '2',
      label: '生成架构图',
      icon: <AppstoreOutlined />,
      description: '创建系统架构图',
    },
    {
      key: '3',
      label: '生成思维导图',
      icon: <BulbOutlined />,
      description: '整理思路和想法',
    },
  ]

  return (
    <>
      {/* 标题栏 */}
      <div
        style={{
          height: 64,
          borderBottom: '1px solid #f0f0f0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, #fff, #fafafa)',
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
            <RobotOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>AI 助手</div>
            {isAuthenticated && user && (
              <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                {user.nickname || user.phone}
              </div>
            )}
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleClear}
            title="清空对话"
          />
        )}
      </div>

      {/* 消息列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
        {messages.length === 0 ? (
          <Welcome
            icon={<RobotOutlined style={{ fontSize: 48, color: '#1677ff' }} />}
            title="你好！我是 AI 助手"
            description="有什么可以帮你的吗？"
            extra={
              <>
                {!isAuthenticated && (
                  <div
                    style={{
                      padding: 16,
                      background: 'rgba(22, 119, 255, 0.05)',
                      borderRadius: 8,
                      border: '1px solid rgba(22, 119, 255, 0.2)',
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ color: '#1677ff', fontWeight: 500 }}>
                      💡 发送消息前需要先登录
                    </span>
                  </div>
                )}
                <Prompts
                  items={promptItems}
                  onSelect={(item) => handleSend(item.label as string)}
                  style={{ marginTop: 16 }}
                />
              </>
            }
          />
        ) : (
          <>
            <Bubble.List
              items={bubbleItems}
              roles={{
                user: {
                  placement: 'end',
                  variant: 'filled',
                  avatar: { icon: '👤', style: { background: '#1677ff' } },
                },
                assistant: {
                  placement: 'start',
                  variant: 'outlined',
                  typing: isLoading,
                  avatar: { icon: '🤖' },
                },
              }}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入框 */}
      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          padding: 16,
          background: '#fff',
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
