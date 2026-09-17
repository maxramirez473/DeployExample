import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { registerSchema, type RegisterInput } from '@/schemas/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { applyServerErrors, getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: 'onBlur' })

  const onSubmit = async (data: RegisterInput) => {
    setFormError(null)
    try {
      await registerUser(data)
      navigate(ROUTES.alumnos, { replace: true })
    } catch (error) {
      const handled = applyServerErrors(error, setError)
      if (!handled) {
        setFormError(getApiErrorMessage(error, 'No pudimos crear tu cuenta.'))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registrate para empezar a usar la libreta.
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

          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nombre</FieldLabel>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
              {...register('name')}
            />
            <FieldError id="name-error" errors={[errors.name]} />
          </Field>

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
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              {...register('password')}
            />
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.password_confirmation}>
            <FieldLabel htmlFor="password_confirmation">Confirmar contraseña</FieldLabel>
            <Input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password_confirmation}
              aria-describedby="password-confirmation-error"
              {...register('password_confirmation')}
            />
            <FieldError id="password-confirmation-error" errors={[errors.password_confirmation]} />
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Spinner />}
            Crear cuenta
          </Button>
        </FieldGroup>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link
          to={ROUTES.login}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Ingresá
        </Link>
      </p>
    </div>
  )
}
