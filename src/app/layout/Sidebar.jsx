import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react'
import { NAV_ITEMS, NAV_SECTIONS } from '@/app/router/routes.config'
import { useUiStore } from '@/shared/store/uiStore'

const EASE_OUT = [0.16, 1, 0.3, 1]

/**
 * Sidebar de escritorio — colapsable, agrupada por sección.
 * Ver docs/NAVIGATION_FLOW.md §0.5 y docs/DESIGN_SYSTEM.md §0.5.
 * Oculta por debajo de `lg` (los breakpoints de docs/DESIGN_SYSTEM.md §7);
 * en ese rango la navegación primaria la resuelve BottomNav.
 */
export function Sidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      className="sticky top-0 z-20 hidden h-dvh shrink-0 flex-col border-r border-outline bg-surface-container-low lg:flex"
    >
      <div className="flex h-16 items-center gap-2 overflow-hidden px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
          <Zap size={18} strokeWidth={2.5} fill="currentColor" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap font-heading text-title-md font-semibold text-on-surface"
            >
              F7 Performance
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter((item) => item.section === section.id)
          if (items.length === 0) return null

          return (
            <div key={section.id} className="mb-4">
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-3 text-label-md font-semibold uppercase tracking-wide text-on-surface-variant"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>

              <ul className="flex flex-col gap-0.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className="relative flex h-11 items-center gap-3 rounded-lg px-3 text-title-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-pill"
                              transition={{ duration: 0.25, ease: EASE_OUT }}
                              className="absolute inset-0 rounded-lg bg-primary-container"
                            />
                          )}
                          <item.icon
                            size={20}
                            strokeWidth={isActive ? 2 : 1.5}
                            className="relative z-10 shrink-0"
                            style={{ color: isActive ? 'var(--color-on-primary-container)' : undefined }}
                          />
                          {!collapsed && (
                            <span
                              className="relative z-10 truncate"
                              style={{ color: isActive ? 'var(--color-on-primary-container)' : undefined }}
                            >
                              {item.label}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-outline p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          {collapsed ? <PanelLeftOpen size={20} strokeWidth={1.5} /> : <PanelLeftClose size={20} strokeWidth={1.5} />}
          {!collapsed && <span className="text-title-sm font-medium">Colapsar</span>}
        </button>
      </div>
    </motion.aside>
  )
}
