import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sun, Moon } from 'lucide-react'
import { getNavItemByPath } from '@/app/router/routes.config'
import { useUiStore } from '@/shared/store/uiStore'

/**
 * Barra superior: título de la pantalla activa + buscador (desktop) +
 * toggle rápido de tema + avatar. Ver docs/NAVIGATION_FLOW.md §0.5 y
 * docs/UX_DESIGN.md (header por pantalla).
 */
export function Topbar() {
  const location = useLocation()
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)

  const activeItem = getNavItemByPath(location.pathname)
  const resolvedDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  function handleToggleTheme() {
    setTheme(resolvedDark ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-outline bg-surface-container-lowest/80 px-4 backdrop-blur-xl lg:h-16 lg:px-8">
      <AnimatePresence mode="wait">
        <motion.h1
          key={activeItem?.id ?? 'page'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="font-heading text-title-md font-semibold text-on-surface lg:text-headline-sm"
        >
          {activeItem?.label ?? 'F7 Performance Pro'}
        </motion.h1>
      </AnimatePresence>

      <div className="hidden flex-1 justify-center lg:flex">
        <div className="flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-outline bg-surface-container-low px-4 text-on-surface-variant">
          <Search size={16} strokeWidth={1.5} />
          <span className="text-body-sm">Buscar en F7 Performance Pro…</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label="Cambiar tema"
          className="relative flex size-10 items-center justify-center overflow-hidden rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={resolvedDark ? 'moon' : 'sun'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {resolvedDark ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          type="button"
          aria-label="Cuenta"
          className="flex size-10 items-center justify-center rounded-full bg-primary text-label-md font-bold text-on-primary"
        >
          L
        </button>
      </div>
    </header>
  )
}
