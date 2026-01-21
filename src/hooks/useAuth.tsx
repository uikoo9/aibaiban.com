import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { AuthState, User, LoginParams } from '@/types/auth'
import { sendSmsCode } from '@/services/auth'

const STORAGE_KEY = 'auth-user'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  login: (params: LoginParams) => Promise<User>
  logout: () => void
  sendVerificationCode: (phone: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  // 加载本地存储的用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY)
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
        })
      } catch (error) {
        console.error('Failed to load user from storage:', error)
        setState({ isAuthenticated: false, user: null, isLoading: false })
      }
    } else {
      setState({ isAuthenticated: false, user: null, isLoading: false })
    }
  }, [])

  // Mock 登录 - 仅做 UI 展示，不做真实验证
  const login = useCallback(async (params: LoginParams) => {
    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock 用户数据
    const user: User = {
      id: Date.now().toString(),
      phone: params.phone,
      nickname: `用户${params.phone.slice(-4)}`,
    }

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    setState({
      isAuthenticated: true,
      user,
      isLoading: false,
    })

    return user
  }, [])

  // 退出登录
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })
  }, [])

  // 发送验证码 - 使用真实 API
  const sendVerificationCode = useCallback(async (phone: string) => {
    const response = await sendSmsCode(phone)

    if (response.type === 'success') {
      console.log('验证码已发送到:', phone)
      return true
    } else {
      // 业务逻辑错误，抛出给调用方处理
      throw new Error(response.msg || '发送验证码失败')
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isLoading: state.isLoading,
        login,
        logout,
        sendVerificationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
