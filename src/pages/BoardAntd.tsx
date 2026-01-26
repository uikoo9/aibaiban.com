import { Suspense, lazy, useState, useRef, useEffect } from 'react'
import { ConfigProvider, Button, Dropdown, Avatar, Spin } from 'antd'
import { XProvider } from '@ant-design/x'
import {
  UserOutlined,
  LogoutOutlined,
  GithubOutlined,
  BulbOutlined,
  DragOutlined,
} from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import { ChatPanelAntd } from '@/components/Chat/ChatPanelAntd'
import { LoginModalAntd } from '@/components/Auth/LoginModalAntd'
import { useAuth } from '@/hooks/useAuth'
import type { WhiteboardHandle } from '@/components/Whiteboard'
import type { SimplifiedDiagram } from '@/types/diagram'

const Whiteboard = lazy(() =>
  import('@/components/Whiteboard').then((m) => ({ default: m.Whiteboard }))
)

const MIN_CHAT_WIDTH = 280
const MAX_CHAT_WIDTH = 600
const DEFAULT_CHAT_WIDTH = 380
const CHAT_WIDTH_STORAGE_KEY = 'chat-panel-width'

function BoardAntd() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const whiteboardRef = useRef<WhiteboardHandle>(null)

  // 聊天面板宽度状态
  const [chatWidth, setChatWidth] = useState(() => {
    const saved = localStorage.getItem(CHAT_WIDTH_STORAGE_KEY)
    return saved ? Number(saved) : DEFAULT_CHAT_WIDTH
  })
  const [isResizing, setIsResizing] = useState(false)

  // 当前主题（简化版，这里使用 localStorage 模拟）
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  // 处理 AI 生成的图表
  const handleDrawDiagram = (diagram: SimplifiedDiagram) => {
    console.log('📊 收到图表数据，准备渲染到白板:', diagram)
    whiteboardRef.current?.addAIGeneratedDiagram(diagram)
  }

  // 保存宽度到 LocalStorage
  useEffect(() => {
    localStorage.setItem(CHAT_WIDTH_STORAGE_KEY, String(chatWidth))
  }, [chatWidth])

  // 处理拖动
  const handleMouseDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX
      const clampedWidth = Math.max(MIN_CHAT_WIDTH, Math.min(MAX_CHAT_WIDTH, newWidth))
      setChatWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing])

  // 主题切换（简化版）
  const themeMenuItems = [
    { key: 'light', label: '浅色' },
    { key: 'dark', label: '深色' },
  ]

  const handleThemeChange = ({ key }: { key: string }) => {
    setCurrentTheme(key)
    localStorage.setItem('theme', key)
    document.documentElement.setAttribute('data-theme', key)
  }

  // 用户菜单
  const userMenuItems = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <XProvider>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* 顶部导航栏 */}
          <header
            style={{
              height: 64,
              borderBottom: '1px solid #f0f0f0',
              background: 'linear-gradient(to bottom, #fff, #fafafa)',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              zIndex: 50,
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
                <img
                  src={`${import.meta.env.BASE_URL}logo.svg`}
                  alt="AI白板"
                  style={{ height: 24, width: 24 }}
                />
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>AI 白板</h1>
                <p style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)', margin: 0 }}>
                  aibaiban.com
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* 登录/用户信息 */}
              {isAuthenticated && user ? (
                <Dropdown
                  menu={{
                    items: userMenuItems,
                    onClick: ({ key }) => {
                      if (key === 'logout') logout()
                    },
                  }}
                  placement="bottomRight"
                >
                  <Button type="text" style={{ height: 40, padding: '0 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar size={32} style={{ background: '#1677ff' }} icon={<UserOutlined />} />
                      <span style={{ fontWeight: 500 }}>{user.phone}</span>
                    </div>
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={() => setIsLoginModalOpen(true)}
                  style={{ height: 40 }}
                >
                  登录
                </Button>
              )}

              {/* 主题切换 */}
              <Dropdown
                menu={{
                  items: themeMenuItems,
                  onClick: handleThemeChange,
                  selectedKeys: [currentTheme],
                }}
                placement="bottomRight"
              >
                <Button type="text" icon={<BulbOutlined />} style={{ height: 40 }}>
                  主题
                </Button>
              </Dropdown>

              {/* GitHub 链接 */}
              <Button
                type="text"
                icon={<GithubOutlined />}
                href="https://github.com/uikoo9/aibaiban.com"
                target="_blank"
                style={{ height: 40 }}
              >
                GitHub
              </Button>
            </div>
          </header>

          {/* 主内容区域 */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            {/* 白板区域 */}
            <div style={{ flex: 1, background: '#f5f5f5', position: 'relative' }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Spin size="large" />
                  </div>
                }
              >
                <Whiteboard ref={whiteboardRef} />
              </Suspense>
            </div>

            {/* 可拖动分隔条 */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                width: isResizing ? 6 : 4,
                background: isResizing ? '#1677ff' : '#d9d9d9',
                cursor: 'col-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 20,
                transition: isResizing ? 'none' : 'all 0.2s',
              }}
            >
              {/* 拖动手柄 */}
              <div
                style={{
                  position: 'absolute',
                  background: isResizing ? '#1677ff' : '#d9d9d9',
                  borderRadius: '50%',
                  padding: 4,
                  opacity: isResizing ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <DragOutlined style={{ fontSize: 12, color: '#fff' }} />
              </div>
            </div>

            {/* 聊天面板 */}
            <aside
              style={{
                width: chatWidth,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: '#fff',
                borderLeft: '1px solid #f0f0f0',
                zIndex: 10,
              }}
            >
              <ChatPanelAntd onDrawDiagram={handleDrawDiagram} />
            </aside>
          </div>

          {/* 登录弹窗 */}
          <LoginModalAntd open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
      </XProvider>
    </ConfigProvider>
  )
}

export default BoardAntd
