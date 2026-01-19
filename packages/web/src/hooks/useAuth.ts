import { useState, useEffect, useCallback } from 'react'
import type { AuthState, User, LoginParams } from '@/types/auth'

const STORAGE_KEY = 'auth-user'

export function useAuth() {
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

  // Mock 发送验证码
  const sendVerificationCode = useCallback(async (phone: string) => {
    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock 成功（实际应该调用后端 API）
    console.log('验证码已发送到:', phone)
    return true
  }, [])

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    login,
    logout,
    sendVerificationCode,
  }
}
