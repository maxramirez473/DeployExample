import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Ingresá tu email.').email('Ingresá un email válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Ingresá tu nombre.').max(255),
    email: z.string().min(1, 'Ingresá tu email.').email('Ingresá un email válido.'),
    password: z.string().min(6, 'Debe tener al menos 6 caracteres.'),
    password_confirmation: z.string().min(1, 'Confirmá tu contraseña.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
