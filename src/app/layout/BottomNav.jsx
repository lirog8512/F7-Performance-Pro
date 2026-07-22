import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRIMARY_NAV_ITEMS } from '@/app/router/routes.config'

const EASE_OUT = [0.16, 1, 0.3, 1]

/**
 * Bottom Tab Bar — navegación primaria en mobile/tablet.
 * Ver docs/NAVIGATION_FLOW.md §0.5 y material "regular" de
 * docs/DESIGN_SYSTEM.md §5.2 (blur, reservado para chrome flotante).
 */
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-outline bg-surface-container-low/80 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink key={item.id} to={item.path} className="relative flex flex-1 flex-col items-center justify-center gap-1">
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-pill"
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="absolute top-1.5 h-8 w-12 rounded-full bg-primary-container"
                />
              )}
              <item.icon
                size={20}
                strokeWidth={isActive ? 2.25 : 1.5}
                className="relative z-10"
                style={{ color: isActive ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)' }}
              />
              <span
                className="relative z-10 text-label-sm font-semibold"
                style={{ color: isActive ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}
              >
                {item.bottomLabel ?? item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
