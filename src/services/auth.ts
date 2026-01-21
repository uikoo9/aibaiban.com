import { api } from './api'
import type { ApiResponse } from '@/types/api'

/**
 * 发送短信验证码
 * @param mobile 手机号
 * @returns Promise<ApiResponse>
 */
export async function sendSmsCode(mobile: string): Promise<ApiResponse> {
  return api.post('/sms', { mobile })
}

/**
 * 手机号登录（预留接口，当前使用 mock）
 * @param mobile 手机号
 * @param _code 验证码（当前未使用，等待后端接口）
 * @returns Promise<ApiResponse>
 */
export async function loginWithSms(
  mobile: string,
  _code: string
): Promise<ApiResponse> {
  // TODO: 替换为真实登录接口
  // return api.post('/login', { mobile, code: _code })

  // 暂时返回 mock 数据
  return {
    type: 'success',
    msg: '登录成功',
    obj: {
      id: Date.now().toString(),
      phone: mobile,
      nickname: `用户${mobile.slice(-4)}`,
    },
  }
}
