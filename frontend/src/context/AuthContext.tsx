import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { AUTH_TOKEN_KEY } from '@/config/constants'
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service'
import { setUnauthorizedHandler } from '@/services/api'
import type { User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  /** true mientras se valida el token guardado contra GET /user al cargar la app */
  isCheckingSession: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(
    () => !!localStorage.getItem(AUTH_TOKEN_KEY),
  )
  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
  }, [clearSession])

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    // Sin token no hay nada que validar: isCheckingSession ya arrancó en false.
    if (!token) return

    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setIsCheckingSession(false))
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const { user, token } = await authService.login(payload)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setUser(user)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user, token } = await authService.register(payload)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setUser(user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Si el logout en el servidor falla (por ejemplo, el token ya venció)
      // igual queremos limpiar la sesión local.
    }
    clearSession()
  }, [clearSession])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isCheckingSession, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
