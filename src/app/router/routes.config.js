import {
  Home,
  Dumbbell,
  Calendar,
  BarChart3,
  User,
  Utensils,
  Moon,
  BookOpen,
  History,
  Settings,
} from 'lucide-react'

/**
 * Metadata declarativa de navegación — fuente única para Sidebar, BottomNav
 * y Topbar (título de pantalla). Ver docs/NAVIGATION_FLOW.md §0.5 y §2.
 */

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', path: '/dashboard', icon: Home, section: 'principal', primary: true },
  { id: 'trainings', label: 'Entrenamientos', path: '/trainings', icon: Dumbbell, section: 'principal', primary: true, bottomLabel: 'Entrenar' },
  { id: 'calendar', label: 'Calendario', path: '/calendar', icon: Calendar, section: 'principal', primary: true },
  { id: 'stats', label: 'Estadísticas', path: '/stats', icon: BarChart3, section: 'principal', primary: true },
  { id: 'nutrition', label: 'Nutrición', path: '/nutrition', icon: Utensils, section: 'bienestar' },
  { id: 'recovery', label: 'Recuperación', path: '/recovery', icon: Moon, section: 'bienestar' },
  { id: 'library', label: 'Biblioteca', path: '/library', icon: BookOpen, section: 'recursos' },
  { id: 'history', label: 'Historial', path: '/history', icon: History, section: 'recursos' },
  { id: 'profile', label: 'Perfil', path: '/profile', icon: User, section: 'cuenta', primary: true },
  { id: 'settings', label: 'Configuración', path: '/settings', icon: Settings, section: 'cuenta' },
]

export const NAV_SECTIONS = [
  { id: 'principal', label: 'Principal' },
  { id: 'bienestar', label: 'Bienestar' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'cuenta', label: 'Cuenta' },
]

export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.primary)

export function getNavItemByPath(pathname) {
  return NAV_ITEMS.find((item) => pathname.startsWith(item.path))
}
