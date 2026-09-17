import { useCallback, useState } from 'react'
import { alumnosService, type AsignarEvaluacionPayload } from '@/services/alumnos.service'

export function useAsignarEvaluacion() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutateAsync = useCallback(
    async ({ alumnoId, ...payload }: AsignarEvaluacionPayload & { alumnoId: number }) => {
      setIsSubmitting(true)
      try {
        return await alumnosService.asignarEvaluacion(alumnoId, payload)
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return { mutateAsync, isSubmitting }
}
