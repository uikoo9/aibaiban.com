import type { ApiResponse } from '@/types/api'

/**
 * 基础 API 配置
 */
const API_BASE_URL = 'https://aibaiban.com'

/**
 * API 请求错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 发送 POST 请求
 */
async function post<T = any>(
  endpoint: string,
  data: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    // 构建 URL 编码的表单数据
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    // 解析 JSON 响应
    const result: ApiResponse<T> = await response.json()

    // 检查业务逻辑错误
    if (result.type === 'error') {
      throw new ApiError(result.msg, response.status, result)
    }

    return result
  } catch (error) {
    // 处理网络错误或解析错误
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiError(`网络请求失败: ${error.message}`)
    }

    throw new ApiError('未知错误')
  }
}

/**
 * API 服务对象
 */
export const api = {
  post,
}
