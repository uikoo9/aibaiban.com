export interface User {
  id: string
  phone: string
  nickname?: string
  avatar?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export interface LoginParams {
  phone: string
  code: string
}
