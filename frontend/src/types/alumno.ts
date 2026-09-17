import type { Grupo } from './grupo'
import type { EvaluacionConNota } from './evaluacion'

export interface Alumno {
  id: number
  legajo: number
  nombres: string
  apellidos: string
  grupo_id: number | null
}

/** Tal como viene en GET /alumnos, con el grupo cargado */
export interface AlumnoConGrupo extends Alumno {
  grupo: Grupo | null
}

/** Tal como viene en GET /alumnos/{id} */
export interface AlumnoDetalle extends AlumnoConGrupo {
  evaluaciones: EvaluacionConNota[]
}
