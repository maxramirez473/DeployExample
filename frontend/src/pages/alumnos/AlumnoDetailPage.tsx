import { ArrowLeft, ClipboardList, Plus } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useAlumno } from '@/hooks/useAlumnos'
import { useEvaluaciones } from '@/hooks/useEvaluaciones'
import { AsignarEvaluacionDialog } from '@/components/AsignarEvaluacionDialog'
import { EmptyState } from '@/components/EmptyState'
import { GradeScale } from '@/components/GradeScale'
import { NotaEstado } from '@/components/NotaEstado'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatApellidoNombre, formatFecha } from '@/utils/format'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'

export function AlumnoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const alumnoQuery = useAlumno(id!)
  const evaluacionesQuery = useEvaluaciones()

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.alumnos}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Alumnos
      </Link>

      {alumnoQuery.isLoading && (
        <div className="space-y-3" aria-hidden="true">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      )}

      {alumnoQuery.isError && (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(alumnoQuery.error, 'No pudimos cargar este alumno.')}
        </p>
      )}

      {alumnoQuery.data && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {formatApellidoNombre(alumnoQuery.data.apellidos, alumnoQuery.data.nombres)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Legajo <span className="tabular-nums">{alumnoQuery.data.legajo}</span>
                {alumnoQuery.data.grupo && <> · {alumnoQuery.data.grupo.nombre}</>}
              </p>
            </div>

            {evaluacionesQuery.data && (
              <AsignarEvaluacionDialog
                alumnoId={alumnoQuery.data.id}
                evaluaciones={evaluacionesQuery.data}
                onSuccess={() => alumnoQuery.refetch()}
                trigger={
                  <Button>
                    <Plus className="size-4" />
                    Asignar evaluación
                  </Button>
                }
              />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground">Evaluaciones</h2>

            {alumnoQuery.data.evaluaciones.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Todavía no tiene notas"
                description="Asigná la primera evaluación para este alumno."
              />
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {alumnoQuery.data.evaluaciones.map((evaluacion) => (
                  <li key={evaluacion.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="sm:w-40 sm:shrink-0">
                      <p className="font-medium">{evaluacion.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFecha(evaluacion.pivot.fecha_evaluacion)}
                      </p>
                    </div>
                    <div className="flex flex-1 items-center gap-4">
                      <span className="w-8 shrink-0 text-2xl font-semibold tabular-nums">
                        {evaluacion.pivot.nota}
                      </span>
                      <GradeScale
                        minAprobacion={evaluacion.nota_minima_aprobacion}
                        minPromocion={evaluacion.nota_minima_promocion}
                        nota={evaluacion.pivot.nota}
                        className="max-w-xs flex-1"
                      />
                      <NotaEstado
                        nota={evaluacion.pivot.nota}
                        minAprobacion={evaluacion.nota_minima_aprobacion}
                        minPromocion={evaluacion.nota_minima_promocion}
                        className="shrink-0"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
