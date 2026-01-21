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
 * 手机号登录
 * @param mobile 手机号
 * @param code 验证码
 * @returns Promise<ApiResponse>
 */
export async function loginWithSms(
  mobile: string,
  code: string
): Promise<ApiResponse> {
  return api.post('/user/login', { mobile, code })
}
