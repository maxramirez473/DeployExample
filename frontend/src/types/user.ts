export interface User {
  id: number
  name: string
  email: string
  created_at: string | null
}

export interface AuthResponse {
  user: User
  token: string
}
