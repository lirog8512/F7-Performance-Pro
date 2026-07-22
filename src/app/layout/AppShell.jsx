import { Sidebar } from '@/app/layout/Sidebar'
import { BottomNav } from '@/app/layout/BottomNav'
import { Topbar } from '@/app/layout/Topbar'
import { PageContainer } from '@/app/layout/PageContainer'

/**
 * Layout autenticado: Sidebar (desktop) + Topbar + contenido de ruta + BottomNav (mobile).
 * Ver docs/NAVIGATION_FLOW.md §0.5.
 */
export function AppShell() {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />

      <div className="flex min-h-dvh flex-1 flex-col">
        <Topbar />
        <PageContainer />
        {/* Espacio reservado para que el contenido no quede oculto tras la bottom nav (mobile) */}
        <div className="h-16 shrink-0 lg:hidden" aria-hidden="true" />
      </div>

      <BottomNav />
    </div>
  )
}
