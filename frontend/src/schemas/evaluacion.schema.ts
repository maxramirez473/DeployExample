import { z } from 'zod'

/**
 * Nota: la nota se guarda como integer en la base (0 a 10), así que acá
 * también se valida como entero para no dejar pasar valores que el
 * backend rechazaría o truncaría en silencio.
 */
export const asignarEvaluacionSchema = z.object({
  alumno_id: z.number({
    required_error: 'Seleccioná un alumno.',
    invalid_type_error: 'Seleccioná un alumno.',
  }).int().positive('Seleccioná un alumno.'),
  evaluacion_id: z.number({
    required_error: 'Seleccioná una evaluación.',
    invalid_type_error: 'Seleccioná una evaluación.',
  }).int().positive('Seleccioná una evaluación.'),
  nota: z.number({
    required_error: 'Ingresá una nota.',
    invalid_type_error: 'Ingresá una nota.',
  }).int('La nota debe ser un número entero.').min(0, 'La nota mínima es 0.').max(10, 'La nota máxima es 10.'),
  fecha_evaluacion: z.string().min(1, 'Elegí una fecha.'),
})

export type AsignarEvaluacionInput = z.infer<typeof asignarEvaluacionSchema>
