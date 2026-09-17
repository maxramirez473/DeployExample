import { ClipboardList, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { useEvaluaciones } from '@/hooks/useEvaluaciones'
import { useAlumnos } from '@/hooks/useAlumnos'
import { AsignarEvaluacionDialog } from '@/components/AsignarEvaluacionDialog'
import { EmptyState } from '@/components/EmptyState'
import { GradeScale } from '@/components/GradeScale'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'

export function EvaluacionesPage() {
  const evaluacionesQuery = useEvaluaciones()
  const alumnosQuery = useAlumnos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluaciones"
        description={
          evaluacionesQuery.data ? `${evaluacionesQuery.data.length} evaluaciones` : undefined
        }
        actions={
          evaluacionesQuery.data &&
          alumnosQuery.data && (
            <AsignarEvaluacionDialog
              evaluaciones={evaluacionesQuery.data}
              alumnos={alumnosQuery.data}
              trigger={
                <Button>
                  <Plus className="size-4" />
                  Asignar evaluación
                </Button>
              }
            />
          )
        }
      />

      {evaluacionesQuery.isLoading && (
        <div className="space-y-2" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      )}

      {evaluacionesQuery.isError && (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(evaluacionesQuery.error, 'No pudimos cargar las evaluaciones.')}
        </p>
      )}

      {evaluacionesQuery.data && evaluacionesQuery.data.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Todavía no hay evaluaciones"
          description="Las evaluaciones aparecen acá una vez cargadas en el sistema."
        />
      )}

      {evaluacionesQuery.data && evaluacionesQuery.data.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Aprueba / promociona</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluacionesQuery.data.map((evaluacion) => (
                <TableRow key={evaluacion.id} className="relative hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      to={ROUTES.evaluacion(evaluacion.id)}
                      className="static after:absolute after:inset-0 focus-visible:outline-none focus-visible:underline"
                    >
                      {evaluacion.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
                        {evaluacion.nota_minima_aprobacion}
                      </span>
                      <GradeScale
                        minAprobacion={evaluacion.nota_minima_aprobacion}
                        minPromocion={evaluacion.nota_minima_promocion}
                        className="max-w-40"
                      />
                      <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
                        {evaluacion.nota_minima_promocion}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
