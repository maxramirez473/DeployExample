import { API_URL } from '@/config/env'
import { AUTH_TOKEN_KEY } from '@/config/constants'

/** Error de la API: incluye el status HTTP y el body ya parseado (si lo había). */
export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Callback que ejecuta AuthProvider para limpiar la sesión cuando la API
 * responde 401 (token vencido o revocado). Se registra desde afuera para
 * evitar que este módulo dependa del contexto de React.
 */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

/** Wrapper de fetch: arma la URL, agrega el token y parsea la respuesta JSON. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, null, 'No pudimos conectar con el servidor. Revisá que la API esté corriendo.')
  }

  if (response.status === 401) {
    onUnauthorized?.()
  }

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : undefined) ?? 'Ocurrió un error inesperado.'
    throw new ApiError(response.status, data, message)
  }

  return data as T
}
