import { apiFetch } from './api'
import type { AlumnoConGrupo, AlumnoDetalle } from '@/types/alumno'
import type { EvaluacionConNota } from '@/types/evaluacion'

export interface AsignarEvaluacionPayload {
  evaluacion_id: number
  nota: number
  fecha_evaluacion: string
}

export const alumnosService = {
  getAll: () => apiFetch<AlumnoConGrupo[]>('/alumnos'),
  getById: (id: number | string) => apiFetch<AlumnoDetalle>(`/alumnos/${id}`),
  getEvaluaciones: (id: number | string) => apiFetch<EvaluacionConNota[]>(`/alumnos/${id}/evaluaciones`),
  asignarEvaluacion: (id: number | string, payload: AsignarEvaluacionPayload) =>
    apiFetch<{ message: string }>(`/alumnos/${id}/evaluaciones`, { method: 'POST', body: payload }),
}
