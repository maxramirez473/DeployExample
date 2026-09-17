import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/services/api'

interface LaravelErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

/** Mensaje legible para mostrar en un toast o alerta general. */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback
  }
  return fallback
}

/**
 * Vuelca los errores de validación 422 de Laravel (`{errors: {campo: [msg]}}`)
 * sobre los campos de un formulario de react-hook-form.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return false
  }

  const errors = (error.body as LaravelErrorBody | null)?.errors
  if (!errors) return false

  for (const [field, messages] of Object.entries(errors)) {
    setError(field as Path<T>, { type: 'server', message: messages[0] })
  }

  return true
}
