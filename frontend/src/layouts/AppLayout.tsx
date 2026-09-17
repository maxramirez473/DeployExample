import { useState, type ComponentType } from 'react'
import { NavLink, Outlet } from 'react-router'
import { GraduationCap, ClipboardList, Menu, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/constants'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent } from '@/components/ui/sheet'

const NAV_ITEMS: { to: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { to: ROUTES.alumnos, label: 'Alumnos', icon: GraduationCap },
  { to: ROUTES.evaluaciones, label: 'Evaluaciones', icon: ClipboardList },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  if (!user) return null

  const inicial = user.name.trim().charAt(0).toUpperCase() || '?'

  const handleLogout = async () => {
    await logout()
    toast.success('Sesión cerrada')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
            aria-label={`Cuenta de ${user.name}`}
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>{inicial}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    // h-svh + overflow-hidden en el contenedor: el sidebar queda fijo y solo
    // el <main> scrollea, en vez de arrastrar toda la página (sidebar incluido).
    <div className="flex h-svh overflow-hidden">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="p-4">
          <span className="text-base font-semibold tracking-tight">Libreta</span>
        </div>
        <NavLinks />
        <div className="space-y-2 border-t border-sidebar-border p-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 lg:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menú"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <SheetContent side="left" className="flex w-64 flex-col gap-0 p-0">
              <div className="p-4">
                <span className="text-base font-semibold tracking-tight">Libreta</span>
              </div>
              <NavLinks onNavigate={() => setMobileNavOpen(false)} />
              <div className="space-y-2 border-t border-sidebar-border p-3">
                <ThemeToggle />
                <UserMenu />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-semibold tracking-tight">Libreta</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
