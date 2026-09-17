import { apiFetch } from './api'
import type { AuthResponse, User } from '@/types/user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  login: (payload: LoginPayload) => apiFetch<AuthResponse>('/login', { method: 'POST', body: payload }),
  register: (payload: RegisterPayload) =>
    apiFetch<AuthResponse>('/register', { method: 'POST', body: payload }),
  logout: () => apiFetch<{ message: string }>('/logout', { method: 'POST' }),
  me: () => apiFetch<User>('/user'),
}
