import { ArrowLeft, Plus, Users } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useEvaluacion, useEvaluacionAlumnos, useEvaluaciones } from '@/hooks/useEvaluaciones'
import { useAlumnos } from '@/hooks/useAlumnos'
import { AsignarEvaluacionDialog } from '@/components/AsignarEvaluacionDialog'
import { EmptyState } from '@/components/EmptyState'
import { GradeScale } from '@/components/GradeScale'
import { NotaEstado } from '@/components/NotaEstado'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatApellidoNombre, formatFecha } from '@/utils/format'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'

export function EvaluacionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const evaluacionQuery = useEvaluacion(id!)
  const alumnosEvaluadosQuery = useEvaluacionAlumnos(id!)
  const evaluacionesQuery = useEvaluaciones()
  const alumnosQuery = useAlumnos()
  const evaluacion = evaluacionQuery.data

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.evaluaciones}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Evaluaciones
      </Link>

      {evaluacionQuery.isLoading && (
        <div className="space-y-3" aria-hidden="true">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      )}

      {evaluacionQuery.isError && (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(evaluacionQuery.error, 'No pudimos cargar esta evaluación.')}
        </p>
      )}

      {evaluacion && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">{evaluacion.nombre}</h1>
              <GradeScale
                minAprobacion={evaluacion.nota_minima_aprobacion}
                minPromocion={evaluacion.nota_minima_promocion}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Aprueba con {evaluacion.nota_minima_aprobacion} o más, promociona con{' '}
                {evaluacion.nota_minima_promocion} o más.
              </p>
            </div>

            {evaluacionesQuery.data && alumnosQuery.data && (
              <AsignarEvaluacionDialog
                evaluacionId={evaluacion.id}
                evaluaciones={evaluacionesQuery.data}
                alumnos={alumnosQuery.data}
                onSuccess={() => alumnosEvaluadosQuery.refetch()}
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
            <h2 className="text-sm font-medium text-muted-foreground">Alumnos evaluados</h2>

            {alumnosEvaluadosQuery.data && alumnosEvaluadosQuery.data.length === 0 && (
              <EmptyState
                icon={Users}
                title="Todavía nadie rindió esta evaluación"
                description="Asigná la evaluación a un alumno para ver su nota acá."
              />
            )}

            {alumnosEvaluadosQuery.data && alumnosEvaluadosQuery.data.length > 0 && (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {alumnosEvaluadosQuery.data.map((alumno) => (
                  <li key={alumno.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="sm:w-56 sm:shrink-0">
                      <Link
                        to={ROUTES.alumno(alumno.id)}
                        className="font-medium hover:underline"
                      >
                        {formatApellidoNombre(alumno.apellidos, alumno.nombres)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatFecha(alumno.pivot.fecha_evaluacion)}
                      </p>
                    </div>
                    <div className="flex flex-1 items-center gap-4">
                      <span className="w-8 shrink-0 text-2xl font-semibold tabular-nums">
                        {alumno.pivot.nota}
                      </span>
                      <GradeScale
                        minAprobacion={evaluacion.nota_minima_aprobacion}
                        minPromocion={evaluacion.nota_minima_promocion}
                        nota={alumno.pivot.nota}
                        className="max-w-xs flex-1"
                      />
                      <NotaEstado
                        nota={alumno.pivot.nota}
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
