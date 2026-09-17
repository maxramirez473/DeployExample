import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate, type Location } from 'react-router'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
    <Card className="border-none py-8 shadow-xl shadow-foreground/5 ring-foreground/10">
      <CardHeader className="gap-1.5 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </CardTitle>
        <CardDescription>Ingresá tus credenciales para continuar.</CardDescription>
      </CardHeader>

      <CardContent>
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
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  className="pl-8"
                  {...register('email')}
                />
              </div>
              <FieldError id="email-error" errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  className="px-8"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldError id="password-error" errors={[errors.password]} />
            </Field>

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting && <Spinner />}
              Iniciar sesión
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{' '}
          <Link
            to={ROUTES.register}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Creá una
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
