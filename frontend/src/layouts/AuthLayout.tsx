import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8">
          <span className="text-lg font-semibold tracking-tight">Libreta</span>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultá alumnos y cargá notas de evaluaciones.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
