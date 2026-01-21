// API 响应类型定义

export interface ApiResponse<T = any> {
  type: 'success' | 'error'
  msg: string
  obj: T | null
}

export interface ApiError {
  type: 'error'
  msg: string
  obj: null
}
