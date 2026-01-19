import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, sendVerificationCode } = useAuth()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  // 控制弹窗显示/隐藏
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  // 监听主题变化并同步到 dialog（修复主题切换不生效问题）
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const syncTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
      dialog.setAttribute('data-theme', currentTheme)
    }

    // 初始化主题
    syncTheme()

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          syncTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 验证手机号
  const isPhoneValid = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!isPhoneValid(phone)) {
      setError('请输入正确的手机号')
      return
    }

    setError('')
    setIsSendingCode(true)

    try {
      await sendVerificationCode(phone)
      setCountdown(60)
    } catch (err) {
      setError('发送验证码失败，请重试')
    } finally {
      setIsSendingCode(false)
    }
  }

  // 登录
  const handleLogin = async () => {
    if (!isPhoneValid(phone)) {
      setError('请输入正确的手机号')
      return
    }

    if (!code || code.length !== 6) {
      setError('请输入 6 位验证码')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await login({ phone, code })
      handleClose()
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 关闭弹窗时重置表单
  const handleClose = () => {
    setPhone('')
    setCode('')
    setError('')
    setCountdown(0)
    onClose()
  }

  // 监听 dialog 的 close 事件
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleDialogClose = () => {
      handleClose()
    }

    dialog.addEventListener('close', handleDialogClose)
    return () => dialog.removeEventListener('close', handleDialogClose)
  }, [])

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-md p-0">
        {/* 标题区域 - 增加顶部装饰和间距 */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent px-8 pt-10 pb-8">
          <div className="text-center">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              欢迎来到 AI 白板
            </h2>
            <p className="text-sm text-base-content/60">
              手机号登录，开启你的创作之旅
            </p>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="px-8 py-6">
          <div className="space-y-5">
            {/* 手机号 */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text text-[15px] font-semibold">手机号码</span>
                <span className="label-text-alt text-error text-xs">必填</span>
              </label>
              <input
                type="tel"
                placeholder="请输入 11 位手机号"
                className={`input input-bordered input-lg w-full text-base ${
                  error && !isPhoneValid(phone) ? 'input-error' : ''
                }`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
                  setError('')
                }}
                maxLength={11}
              />
            </div>

            {/* 验证码 */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text text-[15px] font-semibold">短信验证码</span>
                <span className="label-text-alt text-error text-xs">必填</span>
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  placeholder="请输入 6 位验证码"
                  className={`input input-bordered input-lg join-item flex-1 text-base ${
                    error && code.length > 0 && code.length !== 6 ? 'input-error' : ''
                  }`}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                  }}
                  maxLength={6}
                />
                <button
                  onClick={handleSendCode}
                  disabled={!isPhoneValid(phone) || countdown > 0 || isSendingCode}
                  className="btn btn-lg join-item min-w-[130px] font-medium"
                >
                  {isSendingCode ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : countdown > 0 ? (
                    <span className="text-sm">{countdown}秒后重发</span>
                  ) : (
                    '获取验证码'
                  )}
                </button>
              </div>
              <label className="label pt-1.5">
                <span className="label-text-alt text-base-content/50 text-xs">
                  验证码将发送到您的手机
                </span>
              </label>
            </div>

            {/* 错误提示 */}
            {error && (
              <div role="alert" className="alert alert-error shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              disabled={!isPhoneValid(phone) || code.length !== 6 || isLoading}
              className="btn btn-primary btn-lg w-full text-base font-semibold shadow-lg shadow-primary/20 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>登录中</span>
                </>
              ) : (
                '立即登录'
              )}
            </button>

            {/* 提示文字 */}
            <div className="pt-2 text-center">
              <p className="text-xs text-base-content/50">
                未注册的手机号将自动创建账号
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 点击背景关闭 */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
