import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate, type Location } from 'react-router'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: 'onBlur' })

  const onSubmit = async (data: LoginInput) => {
    setFormError(null)
    try {
      await login(data)
      const from = (location.state as { from?: Location } | null)?.from
      navigate(from?.pathname ?? ROUTES.alumnos, { replace: true })
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No pudimos iniciar sesión.'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ingresar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usá tu cuenta para acceder a la libreta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {formError && (
            <div
              role="alert"
              tabIndex={-1}
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {formError}
            </div>
          )}

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              {...register('email')}
            />
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              {...register('password')}
            />
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Spinner />}
            Ingresar
          </Button>
        </FieldGroup>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿No tenés cuenta?{' '}
        <Link
          to={ROUTES.register}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Creá una
        </Link>
      </p>
    </div>
  )
}
