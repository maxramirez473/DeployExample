import { cloneElement, isValidElement, useEffect, useState, type ReactElement } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { asignarEvaluacionSchema, type AsignarEvaluacionInput } from '@/schemas/evaluacion.schema'
import { useAsignarEvaluacion } from '@/hooks/useAsignarEvaluacion'
import { applyServerErrors, getApiErrorMessage } from '@/utils/errors'
import { hoyISO, formatApellidoNombre } from '@/utils/format'
import { GradeScale } from '@/components/GradeScale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import type { Evaluacion } from '@/types/evaluacion'
import type { AlumnoConGrupo } from '@/types/alumno'

interface AsignarEvaluacionDialogProps {
  /** Elemento que abre el diálogo al hacer click (por ejemplo, un <Button>). */
  trigger: ReactElement
  evaluaciones: Evaluacion[]
  /** Si se da, el alumno queda fijo y no se muestra su selector. */
  alumnoId?: number
  /** Lista para elegir alumno; se usa cuando `alumnoId` no está fijo. */
  alumnos?: AlumnoConGrupo[]
  /** Si se da, la evaluación queda fija y no se muestra su selector. */
  evaluacionId?: number
  /** Se llama después de asignar con éxito, para que la página refresque sus datos. */
  onSuccess?: () => void
}

export function AsignarEvaluacionDialog({
  trigger,
  evaluaciones,
  alumnoId,
  alumnos,
  evaluacionId,
  onSuccess,
}: AsignarEvaluacionDialogProps) {
  const [open, setOpen] = useState(false)
  const asignar = useAsignarEvaluacion()

  const defaultValues = {
    alumno_id: alumnoId as number,
    evaluacion_id: evaluacionId as number,
    nota: undefined as unknown as number,
    fecha_evaluacion: hoyISO(),
  }

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AsignarEvaluacionInput>({
    resolver: zodResolver(asignarEvaluacionSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) reset(defaultValues)
    // Solo interesa reiniciar el formulario cada vez que el diálogo se abre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const evaluacionIdSeleccionada = watch('evaluacion_id')
  const nota = watch('nota')
  const evaluacionSeleccionada = evaluaciones.find((e) => e.id === evaluacionIdSeleccionada)

  const onSubmit = async (data: AsignarEvaluacionInput) => {
    try {
      const { alumno_id, ...payload } = data
      await asignar.mutateAsync({ alumnoId: alumno_id, ...payload })
      toast.success('Evaluación asignada')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      const handled = applyServerErrors(error, setError)
      if (!handled) {
        toast.error(getApiErrorMessage(error, 'No pudimos asignar la evaluación.'))
      }
    }
  }

  return (
    <>
      {isValidElement(trigger) &&
        cloneElement(trigger as ReactElement<{ onClick?: () => void }>, {
          onClick: () => setOpen(true),
        })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar evaluación</DialogTitle>
            <DialogDescription>
              Cargá la nota y la fecha en la que se tomó la evaluación.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FieldGroup>
              {!alumnoId && (
                <Field data-invalid={!!errors.alumno_id}>
                  <FieldLabel htmlFor="alumno_id">Alumno</FieldLabel>
                  <Controller
                    control={control}
                    name="alumno_id"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? null}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger id="alumno_id" className="w-full" aria-invalid={!!errors.alumno_id}>
                          <SelectValue placeholder="Elegí un alumno">
                            {(value: number | null) => {
                              const alumno = (alumnos ?? []).find((a) => a.id === value)
                              return alumno
                                ? `${formatApellidoNombre(alumno.apellidos, alumno.nombres)} · legajo ${alumno.legajo}`
                                : 'Elegí un alumno'
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {(alumnos ?? []).map((alumno) => (
                            <SelectItem key={alumno.id} value={alumno.id}>
                              {formatApellidoNombre(alumno.apellidos, alumno.nombres)} · legajo{' '}
                              {alumno.legajo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.alumno_id]} />
                </Field>
              )}

              {!evaluacionId && (
                <Field data-invalid={!!errors.evaluacion_id}>
                  <FieldLabel htmlFor="evaluacion_id">Evaluación</FieldLabel>
                  <Controller
                    control={control}
                    name="evaluacion_id"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? null}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          id="evaluacion_id"
                          className="w-full"
                          aria-invalid={!!errors.evaluacion_id}
                        >
                          <SelectValue placeholder="Elegí una evaluación">
                            {(value: number | null) =>
                              evaluaciones.find((e) => e.id === value)?.nombre ?? 'Elegí una evaluación'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {evaluaciones.map((evaluacion) => (
                            <SelectItem key={evaluacion.id} value={evaluacion.id}>
                              {evaluacion.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.evaluacion_id]} />
                </Field>
              )}

              <Field data-invalid={!!errors.nota}>
                <FieldLabel htmlFor="nota">Nota (0 a 10)</FieldLabel>
                <Input
                  id="nota"
                  type="number"
                  min={0}
                  max={10}
                  step={1}
                  inputMode="numeric"
                  aria-invalid={!!errors.nota}
                  aria-describedby="nota-error"
                  {...register('nota', { valueAsNumber: true })}
                />
                <FieldError id="nota-error" errors={[errors.nota]} />
              </Field>

              {evaluacionSeleccionada && (
                <GradeScale
                  minAprobacion={evaluacionSeleccionada.nota_minima_aprobacion}
                  minPromocion={evaluacionSeleccionada.nota_minima_promocion}
                  nota={nota}
                  className="pt-1"
                />
              )}

              <Field data-invalid={!!errors.fecha_evaluacion}>
                <FieldLabel htmlFor="fecha_evaluacion">Fecha</FieldLabel>
                <Input
                  id="fecha_evaluacion"
                  type="date"
                  aria-invalid={!!errors.fecha_evaluacion}
                  aria-describedby="fecha-error"
                  {...register('fecha_evaluacion')}
                />
                <FieldError id="fecha-error" errors={[errors.fecha_evaluacion]} />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
