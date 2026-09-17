export const AUTH_TOKEN_KEY = 'libreta:token'

export const ROUTES = {
  login: '/login',
  register: '/register',
  alumnos: '/alumnos',
  alumno: (id: number | string) => `/alumnos/${id}`,
  evaluaciones: '/evaluaciones',
  evaluacion: (id: number | string) => `/evaluaciones/${id}`,
} as const
