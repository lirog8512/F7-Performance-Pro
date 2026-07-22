import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Estado de UI transversal: tema y colapso del sidebar.
 * Ver docs/DESIGN_SYSTEM.md §5.2 y docs/NAVIGATION_FLOW.md §0.5.
 */
export const useUiStore = create(
  persist(
    (set) => ({
      theme: 'system', // 'light' | 'dark' | 'system'
      sidebarCollapsed: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    { name: 'f7.ui.v1' }
  )
)
