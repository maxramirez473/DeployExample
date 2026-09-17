import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'
import { ROUTES } from '@/config/constants'

export function ProtectedRoute() {
  const { isAuthenticated, isCheckingSession } = useAuth()
  const location = useLocation()

  if (isCheckingSession) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
