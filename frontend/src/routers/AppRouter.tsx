import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AlumnosPage } from '@/pages/alumnos/AlumnosPage'
import { AlumnoDetailPage } from '@/pages/alumnos/AlumnoDetailPage'
import { EvaluacionesPage } from '@/pages/evaluaciones/EvaluacionesPage'
import { EvaluacionDetailPage } from '@/pages/evaluaciones/EvaluacionDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ROUTES } from '@/config/constants'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.alumnos} replace /> },
          { path: 'alumnos', element: <AlumnosPage /> },
          { path: 'alumnos/:id', element: <AlumnoDetailPage /> },
          { path: 'evaluaciones', element: <EvaluacionesPage /> },
          { path: 'evaluaciones/:id', element: <EvaluacionDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
