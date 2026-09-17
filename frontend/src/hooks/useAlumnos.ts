import { alumnosService } from '@/services/alumnos.service'
import { useAsyncData } from './useAsyncData'

export function useAlumnos() {
  return useAsyncData(() => alumnosService.getAll(), [])
}

export function useAlumno(id: number | string) {
  return useAsyncData(() => alumnosService.getById(id), [id])
}
