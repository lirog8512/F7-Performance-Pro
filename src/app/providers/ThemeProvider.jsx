import { useEffect } from 'react'
import { useUiStore } from '@/shared/store/uiStore'

/**
 * Resuelve el tema activo ('light' | 'dark' | 'system') a un valor concreto
 * y lo aplica como `data-theme` en <html> — los tokens de
 * src/styles/index.css hacen el resto (docs/DESIGN_SYSTEM.md §5.2).
 */
export function ThemeProvider({ children }) {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyResolvedTheme = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      root.setAttribute('data-theme', resolved)
    }

    applyResolvedTheme()

    if (theme === 'system') {
      media.addEventListener('change', applyResolvedTheme)
      return () => media.removeEventListener('change', applyResolvedTheme)
    }
  }, [theme])

  return children
}
