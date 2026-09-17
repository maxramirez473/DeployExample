import { useCallback, useEffect, useReducer } from 'react'

interface UseAsyncDataResult<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  /** Vuelve a pedir los datos (por ejemplo, después de asignar una evaluación). */
  refetch: () => void
}

interface State<T> {
  data: T | undefined
  isLoading: boolean
  error: unknown
}

type Action<T> = { type: 'start' } | { type: 'success'; data: T } | { type: 'error'; error: unknown }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'start':
      return { ...state, isLoading: true, error: null }
    case 'success':
      return { data: action.data, isLoading: false, error: null }
    case 'error':
      return { ...state, isLoading: false, error: action.error }
  }
}

/**
 * Hook propio para pedir datos a la API con fetch: reemplaza el cache y las
 * invalidaciones de una librería como TanStack Query por un estado simple de
 * carga/error/datos, más un `refetch` manual para cuando el componente que
 * llama sabe que algo cambió (por ejemplo, se asignó una nota).
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): UseAsyncDataResult<T> {
  const [state, dispatch] = useReducer(reducer<T>, { data: undefined, isLoading: true, error: null })
  const [reloadKey, setReloadKey] = useReducer((key: number) => key + 1, 0)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'start' })

    fetcher()
      .then((data) => {
        if (!cancelled) dispatch({ type: 'success', data })
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: 'error', error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  const refetch = useCallback(() => setReloadKey(), [])

  return { data: state.data, isLoading: state.isLoading, isError: state.error !== null, error: state.error, refetch }
}
