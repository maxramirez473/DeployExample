import { evaluacionesService } from '@/services/evaluaciones.service'
import { useAsyncData } from './useAsyncData'

export function useEvaluaciones() {
  return useAsyncData(() => evaluacionesService.getAll(), [])
}

export function useEvaluacion(id: number | string) {
  return useAsyncData(() => evaluacionesService.getById(id), [id])
}

export function useEvaluacionAlumnos(id: number | string) {
  return useAsyncData(() => evaluacionesService.getAlumnos(id), [id])
}
