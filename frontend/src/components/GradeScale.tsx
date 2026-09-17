import { cn } from '@/lib/utils'

interface GradeScaleProps {
  minAprobacion: number
  minPromocion: number
  /** Si se omite, la regla solo muestra los dos umbrales, sin punto de nota. */
  nota?: number | null
  className?: string
}

function clampPct(valor: number) {
  return `${Math.min(100, Math.max(0, (valor / 10) * 100))}%`
}

function colorClaseParaNota(nota: number, minAprobacion: number, minPromocion: number) {
  if (nota < minAprobacion) return 'bg-destructive'
  if (nota < minPromocion) return 'bg-warning'
  return 'bg-success'
}

/**
 * Regla de 0 a 10 que ubica los umbrales de aprobación y promoción de una
 * evaluación, y opcionalmente la nota de un alumno sobre esa misma escala.
 * Es puramente visual: el estado (aprueba, promociona, etc.) siempre se
 * muestra también como texto en el componente que la usa.
 */
export function GradeScale({ minAprobacion, minPromocion, nota, className }: GradeScaleProps) {
  const aprobacionPct = clampPct(minAprobacion)
  const promocionPct = clampPct(minPromocion)

  return (
    <div className={cn('flex items-center gap-2', className)} aria-hidden="true">
      <span className="w-3 shrink-0 text-right text-xs tabular-nums text-muted-foreground">0</span>
      <div className="relative h-1.5 min-w-16 flex-1 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-l-full bg-destructive/35"
          style={{ width: aprobacionPct }}
        />
        <div
          className="absolute inset-y-0 bg-warning/45"
          style={{ left: aprobacionPct, right: `calc(100% - ${promocionPct})` }}
        />
        <div
          className="absolute inset-y-0 right-0 rounded-r-full bg-success/45"
          style={{ left: promocionPct }}
        />
        <span
          className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-foreground/30"
          style={{ left: aprobacionPct }}
        />
        <span
          className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-foreground/30"
          style={{ left: promocionPct }}
        />
        {typeof nota === 'number' && !Number.isNaN(nota) && (
          <span
            className={cn(
              'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-sm transition-[left] duration-150 ease-out',
              colorClaseParaNota(nota, minAprobacion, minPromocion),
            )}
            style={{ left: clampPct(nota) }}
          />
        )}
      </div>
      <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">10</span>
    </div>
  )
}
