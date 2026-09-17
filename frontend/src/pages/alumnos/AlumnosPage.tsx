import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Search, GraduationCap } from 'lucide-react'
import { useAlumnos } from '@/hooks/useAlumnos'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatApellidoNombre } from '@/utils/format'
import { getApiErrorMessage } from '@/utils/errors'
import { ROUTES } from '@/config/constants'

const POR_PAGINA = 10

export function AlumnosPage() {
  const { data: alumnos, isLoading, isError, error } = useAlumnos()
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    if (!alumnos) return []
    const q = busqueda.trim().toLowerCase()
    if (!q) return alumnos
    return alumnos.filter((a) =>
      `${a.apellidos} ${a.nombres} ${a.legajo}`.toLowerCase().includes(q),
    )
  }, [alumnos, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))

  // Si cambia la búsqueda, volvemos a la primera página (ajuste de estado
  // durante el render, no en un efecto: evita un repintado extra).
  const [busquedaPrevia, setBusquedaPrevia] = useState(busqueda)
  if (busqueda !== busquedaPrevia) {
    setBusquedaPrevia(busqueda)
    setPagina(1)
  }

  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  return (
    <div className="space-y-6">
      <PageHeader title="Alumnos" description={alumnos ? `${alumnos.length} alumnos` : undefined} />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, apellido o legajo…"
          className="pl-8"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar alumno"
        />
      </div>

      {isLoading && (
        <div className="space-y-2" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(error, 'No pudimos cargar los alumnos.')}
        </p>
      )}

      {!isLoading && !isError && filtrados.length === 0 && (
        <EmptyState
          icon={GraduationCap}
          title={busqueda ? 'Sin resultados' : 'Todavía no hay alumnos'}
          description={
            busqueda
              ? 'Probá con otro nombre, apellido o legajo.'
              : 'Los alumnos aparecen acá una vez cargados en el sistema.'
          }
        />
      )}

      {!isLoading && !isError && filtrados.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Legajo</TableHead>
                  <TableHead>Apellido y nombres</TableHead>
                  <TableHead>Grupo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginados.map((alumno) => (
                  <TableRow key={alumno.id} className="relative hover:bg-muted/50">
                    <TableCell className="tabular-nums text-muted-foreground">
                      {alumno.legajo}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        to={ROUTES.alumno(alumno.id)}
                        className="static after:absolute after:inset-0 focus-visible:outline-none focus-visible:underline"
                      >
                        {formatApellidoNombre(alumno.apellidos, alumno.nombres)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {alumno.grupo?.nombre ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPaginas > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Anterior"
                    aria-label="Ir a la página anterior"
                    className={pagina === 1 ? 'pointer-events-none opacity-50' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      setPagina((p) => Math.max(1, p - 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === pagina}
                      onClick={(e) => {
                        e.preventDefault()
                        setPagina(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text="Siguiente"
                    aria-label="Ir a la página siguiente"
                    className={pagina === totalPaginas ? 'pointer-events-none opacity-50' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      setPagina((p) => Math.min(totalPaginas, p + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
