import { apiFetch } from './api'
import type { AlumnoEvaluado, Evaluacion, EvaluacionDetalle } from '@/types/evaluacion'

export const evaluacionesService = {
  getAll: () => apiFetch<Evaluacion[]>('/evaluaciones'),
  getById: (id: number | string) => apiFetch<EvaluacionDetalle>(`/evaluaciones/${id}`),
  getAlumnos: (id: number | string) => apiFetch<AlumnoEvaluado[]>(`/evaluaciones/${id}/alumnos`),
}
