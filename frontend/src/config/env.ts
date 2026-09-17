/**
 * Único lugar del código que lee variables de entorno de Vite.
 * Para apuntar el frontend a otro backend (por ejemplo, al desplegar en Railway)
 * alcanza con cambiar VITE_API_URL y volver a compilar (`npm run build`),
 * ya que Vite embebe su valor en el bundle al momento del build.
 */

const rawApiUrl = import.meta.env.VITE_API_URL

if (!rawApiUrl) {
  console.error(
    'Falta la variable de entorno VITE_API_URL. Copiá .env.example a .env y completala.',
  )
}

export const API_URL = rawApiUrl?.replace(/\/+$/, '') ?? ''
