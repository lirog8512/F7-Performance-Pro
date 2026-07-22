import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const EASE_OUT = [0.16, 1, 0.3, 1]

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/**
 * Contenedor de página + transición de ruta.
 * Ver docs/NAVIGATION_FLOW.md §6 ("Transición de página": fade + translateY(8px))
 * y docs/DESIGN_SYSTEM.md §0.3 (padding de pantalla / max-width).
 */
export function PageContainer() {
  const location = useLocation()

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-3 sm:px-6 lg:px-8 lg:py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
