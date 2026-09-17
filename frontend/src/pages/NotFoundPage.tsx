import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { ROUTES } from '@/config/constants'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <EmptyState
        icon={FileQuestion}
        title="Página no encontrada"
        description="La página que buscás no existe o cambió de dirección."
        action={
          <Link to={ROUTES.alumnos} className={buttonVariants()}>
            Ir a alumnos
          </Link>
        }
      />
    </div>
  )
}
