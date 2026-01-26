import { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Alert, Space } from 'antd'
import { PhoneOutlined, SafetyOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'

interface LoginModalAntdProps {
  open: boolean
  onClose: () => void
}

export function LoginModalAntd({ open, onClose }: LoginModalAntdProps) {
  const { login, sendVerificationCode } = useAuth()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 当弹窗关闭时重置倒计时
  useEffect(() => {
    if (!open) {
      setCountdown(0)
    }
  }, [open])

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue('phone')
      await form.validateFields(['phone'])

      setError('')
      setIsSendingCode(true)

      await sendVerificationCode(phone)
      setCountdown(60)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsSendingCode(false)
    }
  }

  // 登录
  const handleLogin = async (values: { phone: string; code: string }) => {
    setError('')
    setIsLoading(true)

    try {
      await login({ phone: values.phone, code: values.code })
      form.resetFields()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败，请重试'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 关闭弹窗时重置表单
  const handleCancel = () => {
    form.resetFields()
    setError('')
    setCountdown(0)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={480}
      centered
      destroyOnHidden
    >
      {/* 标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(22, 119, 255, 0.1)',
            marginBottom: 16,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="AI白板"
            style={{ width: 40, height: 40 }}
          />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 8px 0' }}>
          欢迎来到 AI 白板
        </h2>
        <p style={{ color: 'rgba(0, 0, 0, 0.45)', margin: 0 }}>
          手机号登录，开启你的创作之旅
        </p>
      </div>

      {/* 表单 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        autoComplete="off"
        requiredMark="optional"
      >
        {/* 手机号 */}
        <Form.Item
          name="phone"
          label="手机号码"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入 11 位手机号"
            size="large"
            maxLength={11}
            onChange={() => setError('')}
          />
        </Form.Item>

        {/* 验证码 */}
        <Form.Item
          name="code"
          label="短信验证码"
          rules={[
            { required: true, message: '请输入验证码' },
            { len: 6, message: '验证码为 6 位数字' },
          ]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<SafetyOutlined />}
              placeholder="请输入 6 位验证码"
              size="large"
              maxLength={6}
              onChange={() => setError('')}
              style={{ flex: 1 }}
            />
            <Button
              size="large"
              onClick={handleSendCode}
              disabled={countdown > 0 || isSendingCode}
              loading={isSendingCode}
              style={{ minWidth: 120 }}
            >
              {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
            </Button>
          </Space.Compact>
        </Form.Item>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 登录按钮 */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            block
            style={{ height: 48, fontSize: 16, fontWeight: 600 }}
          >
            立即登录
          </Button>
        </Form.Item>

        {/* 提示文字 */}
        <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
          未注册的手机号将自动创建账号
        </div>
      </Form>
    </Modal>
  )
}
