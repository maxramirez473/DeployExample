import { cn } from '@/lib/utils'

interface NotaEstadoProps {
  nota: number
  minAprobacion: number
  minPromocion: number
  className?: string
}

function estadoDe(nota: number, minAprobacion: number, minPromocion: number) {
  if (nota < minAprobacion) return { texto: 'Desaprobado', clase: 'text-destructive' }
  if (nota < minPromocion) return { texto: 'Aprueba', clase: 'text-warning' }
  return { texto: 'Promociona', clase: 'text-success' }
}

/** Estado de una nota en texto (nunca solo color), acorde a los umbrales de la evaluación. */
export function NotaEstado({ nota, minAprobacion, minPromocion, className }: NotaEstadoProps) {
  const { texto, clase } = estadoDe(nota, minAprobacion, minPromocion)
  return <span className={cn('text-sm font-medium', clase, className)}>{texto}</span>
}
