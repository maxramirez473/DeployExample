import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/config/constants'

/** Login y registro: si ya hay una sesión activa, no tiene sentido volver a mostrarlos. */
export function GuestRoute() {
  const { isAuthenticated, isCheckingSession } = useAuth()

  if (isCheckingSession) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.alumnos} replace />
  }

  return <Outlet />
}
