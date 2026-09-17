import type { Alumno } from './alumno'

export interface Evaluacion {
  id: number
  nombre: string
  nota_minima_aprobacion: number
  nota_minima_promocion: number
}

export interface EvaluacionPivot {
  nota: number
  fecha_evaluacion: string
}

/** Evaluación de un alumno, tal como viene en GET /alumnos/{id} y /alumnos/{id}/evaluaciones */
export interface EvaluacionConNota extends Evaluacion {
  pivot: EvaluacionPivot
}

/** Alumno evaluado, tal como viene en GET /evaluaciones/{id} y /evaluaciones/{id}/alumnos */
export interface AlumnoEvaluado extends Alumno {
  pivot: EvaluacionPivot
}

export interface EvaluacionDetalle extends Evaluacion {
  alumnos: AlumnoEvaluado[]
}
