import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { PagePlaceholder } from '@/app/layout/PagePlaceholder'
import { NAV_ITEMS } from '@/app/router/routes.config'

/**
 * Árbol de rutas. Las pantallas reales (Dashboard, Entrenamientos, ...) se
 * implementan en turnos siguientes — aquí solo se cablea el sistema de
 * rutas sobre el Layout principal. Ver docs/ARCHITECTURE.md §4 y
 * docs/NAVIGATION_FLOW.md §2.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      ...NAV_ITEMS.map((item) => ({
        path: item.path.slice(1),
        element: <PagePlaceholder title={item.label} icon={item.icon} />,
      })),
      {
        path: '*',
        element: <PagePlaceholder title="Página no encontrada" description="La ruta que buscas no existe." />,
      },
    ],
  },
])
