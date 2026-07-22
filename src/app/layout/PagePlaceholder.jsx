/**
 * Placeholder temporal: cada feature real (Dashboard, Entrenamientos, ...)
 * se construye en su propio turno (ver docs/ARCHITECTURE.md). Este
 * componente solo existe para que el Layout principal sea navegable y
 * demostrable mientras tanto.
 */
export function PagePlaceholder({ title, icon: Icon, description }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {Icon ? (
        <div className="flex size-16 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      ) : null}
      <div>
        <h1 className="font-heading text-headline-lg font-bold text-on-surface">{title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {description ?? 'Esta pantalla se construirá en su propio turno.'}
        </p>
      </div>
    </div>
  )
}
