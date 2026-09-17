import { RouterProvider } from 'react-router'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { router } from '@/routers/AppRouter'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}

export default App
