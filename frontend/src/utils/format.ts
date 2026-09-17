/** "RAUL ANTONIO" → "Raúl Antonio" (respeta acentos ya presentes, solo cambia el casing) */
export function formatNombre(texto: string) {
  return texto
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ')
}

export function formatApellidoNombre(apellidos: string, nombres: string) {
  return `${formatNombre(apellidos)}, ${formatNombre(nombres)}`
}

export function formatFecha(fecha: string) {
  const [year, month, day] = fecha.split('-')
  if (!year || !month || !day) return fecha
  return `${day}/${month}/${year}`
}

/** Fecha de hoy en formato yyyy-mm-dd, para usar como valor por defecto en inputs date */
export function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}
