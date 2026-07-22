# F7 Performance Pro — Design System

**Versión:** 1.0 — especificación de tokens y componentes, sin código de aplicación
**Fusión:** Material Design 3 (arquitectura de tokens, shape/elevation system, roles de color) + Apple Human Interface Guidelines (materiales, tipografía dinámica, disciplina de contraste y touch targets)
**Complementa a:** `docs/ARCHITECTURE.md` y `docs/UX_DESIGN.md`

> Los bloques `css` de este documento son **especificación de tokens** (documentación formal de valores), no una hoja de estilos integrada en el build. Sirven como contrato exacto para cuando se implemente `tokens.js` / `tailwind.config.js` (ver `ARCHITECTURE.md §9`).

---

## 0. Filosofía: por qué M3 + Apple HIG y no uno solo

Ningún sistema por sí solo cubre todo lo que necesita una app deportiva profesional:

- **De Material Design 3 tomamos la arquitectura**: el sistema de tokens en 3 capas (referencia → semántico → componente), los *roles de color* (primary/secondary/tertiary + contenedores), la escala de forma (`shape scale`) y el sistema de elevación tonal. Es el sistema más riguroso para apps con muchas pantallas de datos (nuestro caso: Estadísticas, Historial, Calendario).
- **De Apple HIG tomamos la sensibilidad**: la disciplina de *touch targets* (mínimo 44×44pt), los *materiales* (blur/vibrancy para chrome flotante — nav bars, sheets, tab bars), el respeto por *Dynamic Type* (la tipografía debe escalar con la configuración de accesibilidad del sistema) y la calidez visual (radios más generosos, menos "cajas", más "superficies").
- **Resultado:** nomenclatura y arquitectura de M3, pero con radios más suaves, materiales translúcidos en el chrome de navegación (no en cards de contenido) y una capa de alias que traduce cada token a su equivalente HIG, para que cualquier diseñador/desarrollador que venga de uno u otro mundo entienda el sistema sin fricción.

Regla de decisión cuando ambos sistemas difieren: **estructura de datos (roles, tokens, jerarquía) = M3. Sensación al tacto y materialidad (blur, radios, tamaños táctiles) = Apple HIG.**

---

## 1. Arquitectura de tokens (3 capas)

```
Capa 1 — REFERENCE TOKENS   (paleta cruda, no se usa directo en componentes)
   f7.ref.palette.primary.{0..100}
   f7.ref.palette.neutral.{0..100}
   f7.ref.spacing.{0..24}
   f7.ref.type.size.{...}

Capa 2 — SYSTEM TOKENS      (roles semánticos, dependientes de tema claro/oscuro)
   f7.sys.color.primary
   f7.sys.color.on-primary-container
   f7.sys.color.surface
   f7.sys.space.md
   f7.sys.elevation.2
   f7.sys.type.headline-large

Capa 3 — COMPONENT TOKENS   (alias con nombre de uso, lo único que consumen los componentes)
   f7.comp.button.filled.bg              → f7.sys.color.primary
   f7.comp.card.bg                       → f7.sys.color.surface-container-low
   f7.comp.page-title.font               → f7.sys.type.headline-large
```

**Regla de oro:** un componente **nunca** referencia un reference token directamente, y lo ideal es que tampoco referencie system tokens a pelo — siempre pasa por su component token. Esto es lo que permite recolorear/rebranding sin tocar componentes: solo se reasignan los puentes de la Capa 3.

---

## 2. Paleta de colores

### 2.1 Paletas tonales de referencia (Capa 1)

Cada paleta tiene 13 tonos (0=negro, 100=blanco), siguiendo la convención de tono M3. Los valores son de referencia — al implementar, se recomienda regenerarlos con una herramienta HCT (ej. Material Theme Builder) usando estos colores semilla, para garantizar percepción de luminancia uniforme entre tonos.

**Primary — "F7 Volt"** (semilla `#D4FF3F`, tono 80)

| Tono | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | **80** | 90 | 95 | 99 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | `#000000` | `#1A2100` | `#2C3800` | `#3F4F00` | `#536900` | `#698300` | `#829F0A` | `#9DBB1C` | `#D4FF3F` | `#E9FF8F` | `#F4FFC4` | `#FCFFEE` | `#FFFFFF` |

**Secondary — "Deep Court Navy"** (semilla `#254E7D`, tono 40)

| Tono | 0 | 10 | 20 | 30 | **40** | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | `#000000` | `#0A1830` | `#122842` | `#1B3A5E` | `#254E7D` | `#33649C` | `#4A7DB8` | `#6E9AD1` | `#9CBEE6` | `#D2E3F5` | `#E9F1FA` | `#F8FBFE` | `#FFFFFF` |

**Tertiary — "Recovery Indigo"** (semilla `#8B7CF6`, tono 70)

| Tono | 0 | 10 | 20 | 30 | 40 | 50 | 60 | **70** | 80 | 90 | 95 | 99 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | `#000000` | `#190E33` | `#2B1D54` | `#3F2E75` | `#544096` | `#6A54B6` | `#7A64D2` | `#8B7CF6` | `#B3A9FA` | `#DBD5FD` | `#EDE9FE` | `#FAF9FF` | `#FFFFFF` |

**Error — "Alert Coral"** (semilla `#FF5A5F`, tono 70)

| Tono | 0 | 10 | 20 | 30 | 40 | 50 | 60 | **70** | 80 | 90 | 95 | 99 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | `#000000` | `#3A0A0A` | `#5C1210` | `#821D1B` | `#A82824` | `#CB362F` | `#EB4A44` | `#FF5A5F` | `#FF9B9E` | `#FFD5D6` | `#FFEBEC` | `#FFF9F9` | `#FFFFFF` |

**Neutral** (escala de superficies y texto)

| Tono | 0 | 4 | 10 | 12 | 17 | 24 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 92 | 94 | 96 | 98 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hex | `#000000` | `#0B0E11` | `#12151A` | `#171B21` | `#1F242C` | `#2A3038` | `#3A414B` | `#4E5762` | `#6B7280` | `#8A9099` | `#9AA3AF` | `#C7CCD3` | `#E7E9EC` | `#EDEFF2` | `#F1F3F5` | `#F5F6F8` | `#F7F8FA` | `#FFFFFF` |

> Esta rampa **formaliza exactamente** los valores hex ya usados de forma ad-hoc en `UX_DESIGN.md §0.2` (fondo `#F7F8FA`=98, card `#FFFFFF`=100, borde `#E7E9EC`=90, texto secundario `#6B7280`=50, superficie oscura `#171B21`=12, elevada `#1F242C`=17, borde oscuro `#2A3038`=24, texto secundario oscuro `#9AA3AF`=70, texto primario oscuro `#F5F6F8`=96, fondo oscuro `#0B0E11`=4). Confirma que el sistema ya era tonalmente coherente antes de nombrarlo.

**Neutral Variant** (para *outline*/bordes con ligero matiz frío, hereda del hue de Secondary)

| Tono | 30 | 50 | 60 | 80 | 90 |
|---|---|---|---|---|---|
| Hex | `#39414C` | `#6C7480` | `#878F9B` | `#C4CAD3` | `#E3E7EC` |

### 2.2 Colores extendidos de dominio (M3 "Extended Colors")

M3 permite roles de color adicionales a los 3 principales para semántica específica de producto — aquí es donde vive el "código de colores por dominio" ya definido en `UX_DESIGN.md`:

| Rol extendido | Base (tono 60–70) | Container (tono 90) | On-container (tono 10–20) | Uso |
|---|---|---|---|---|
| `physical` | `#FF8A3D` | `#FFE3CC` | `#4D2400` | Entrenamiento físico, carga |
| `technical` | `#2F8FFF` | `#D6E8FF` | `#00264D` | Entrenamiento técnico |
| `tactical` | `#8B6DF2` | `#E6DDFD` | `#2A1259` | Entrenamiento táctico |
| `recovery` | `#8B7CF6` (=Tertiary) | `#DBD5FD` | `#190E33` | Sueño, HRV, recuperación |
| `nutrition` | `#FFB020` | `#FFEBC2` | `#4D3200` | Calorías, macros, hidratación |
| `match` (success) | `#12B76A` | `#CFF5E1` | `#03301C` | Resultados, victorias, logros |
| `warning` | `#F5A623` | `#FCEBCB` | `#4A2E00` | Avisos no críticos |

### 2.3 Roles semánticos (Capa 2 — system tokens), claro vs. oscuro

| Token del sistema | Claro | Oscuro | Nota |
|---|---|---|---|
| `color-primary` | Primary/80 | Primary/80 | **Excepción intencional a M3**: Primary se mantiene en tono 80 también en claro (no baja a tono 40) porque el Volt es un color de marca de alta luminancia — como el "Volt" de Nike, siempre vibra igual, nunca se oscurece para "comportarse". |
| `color-on-primary` | Primary/10 | Primary/10 | Texto casi negro sobre Volt en ambos temas (nunca blanco sobre Volt — falla de contraste). |
| `color-primary-container` | Primary/90 | Primary/30 | Fondos suaves de énfasis (card "Hoy") |
| `color-on-primary-container` | Primary/10 | Primary/90 | |
| `color-secondary` | Secondary/40 | Secondary/80 | Comportamiento M3 estándar (sí invierte con el tema) |
| `color-on-secondary` | `#FFFFFF` | Secondary/20 | |
| `color-secondary-container` | Secondary/90 | Secondary/30 | |
| `color-on-secondary-container` | Secondary/10 | Secondary/90 | |
| `color-tertiary` | Tertiary/40 | Tertiary/80 | |
| `color-on-tertiary` | `#FFFFFF` | Tertiary/20 | |
| `color-tertiary-container` | Tertiary/90 | Tertiary/30 | |
| `color-error` | Error/40 | Error/80 | |
| `color-on-error` | `#FFFFFF` | Error/20 | |
| `color-error-container` | Error/90 | Error/30 | |
| `color-background` | Neutral/98 | Neutral/4 | Fondo de pantalla |
| `color-on-background` | Neutral/10 | Neutral/96 | |
| `color-surface` | Neutral/100 | Neutral/12 | Card por defecto |
| `color-surface-dim` | Neutral/94 | Neutral/4 | |
| `color-surface-bright` | Neutral/100 | Neutral/24 | |
| `color-surface-container-lowest` | Neutral/100 | Neutral/4 | Fondo de página dentro de un contenedor |
| `color-surface-container-low` | Neutral/98 | Neutral/10 | Card en reposo |
| `color-surface-container` | Neutral/96 | Neutral/12 | Card estándar |
| `color-surface-container-high` | Neutral/94 | Neutral/17 | Card elevada / hover |
| `color-surface-container-highest` | Neutral/92 | Neutral/24 | Modal, sheet, popover |
| `color-on-surface` | Neutral/10 | Neutral/96 | Texto primario |
| `color-on-surface-variant` | Neutral/50 | Neutral/70 | Texto secundario |
| `color-outline` | Neutral-Var/90 → usar Neutral/90 | Neutral/24 | Bordes visibles |
| `color-outline-variant` | Neutral/94 | Neutral/17 | Bordes muy sutiles/divisores |
| `color-inverse-surface` | Neutral/20 | Neutral/90 | Toasts, tooltips oscuros sobre tema claro |
| `color-inverse-on-surface` | Neutral/95 | Neutral/20 | |
| `color-scrim` | `#000000` @ 32% | `#000000` @ 55% | Backdrop de modales/sheets |

### 2.4 Puente de nomenclatura con Apple HIG

Para que cualquiera con background iOS entienda el mapeo instantáneamente:

| Nuestro token (M3-style) | Equivalente Apple HIG |
|---|---|
| `color-background` | `systemBackground` |
| `color-surface-container-low` | `secondarySystemBackground` |
| `color-surface-container-high` | `tertiarySystemBackground` |
| `color-on-surface` | `label` |
| `color-on-surface-variant` | `secondaryLabel` |
| `color-outline-variant` | `separator` |
| `color-outline` | `opaqueSeparator` |
| `color-primary` | `tintColor` (accent color de la app) |
| `color-error` | `systemRed` |
| `color-surface-container-highest` (con blur) | *Material* `.regularMaterial` / `.thickMaterial` |

---

## 3. Tipografía

Familia: **Sora** (titulares, pesos 600–800) + **Inter** (cuerpo/UI, pesos 400–700). Ambas variables, con soporte de *Dynamic Type*: todos los tamaños en `rem`, nunca `px`, para heredar la configuración de accesibilidad de tamaño de texto del sistema operativo (principio HIG no negociable).

### 3.1 Escala tipográfica (Capa 2 — 15 estilos M3)

| Token M3 | rem (base 16px) | Peso | Line-height | Tracking | Equivalente Apple | Uso |
|---|---|---|---|---|---|---|
| `display-large` | 2.5rem (40px) | 800 | 1.1 | -0.02em | Large Title (grande) | Número hero de gauge/anillo |
| `display-medium` | 2.25rem (36px) | 800 | 1.12 | -0.02em | Large Title | KPIs principales Dashboard |
| `display-small` | 2rem (32px) | 800 | 1.15 | -0.01em | Large Title (compacto) | Anillo calórico Nutrición |
| `headline-large` | 1.75rem (28px) | 700 | 1.2 | 0 | Title 1 | Título de pantalla (H1) |
| `headline-medium` | 1.5rem (24px) | 700 | 1.25 | 0 | Title 2 | Nombre en Perfil |
| `headline-small` | 1.25rem (20px) | 600 | 1.3 | 0 | Title 3 | Título de sección (H2) |
| `title-large` | 1.125rem (18px) | 600 | 1.35 | 0 | Headline | Card hero title |
| `title-medium` | 1rem (16px) | 600 | 1.4 | 0.01em | Headline (compacto) | Título de card estándar (H3) |
| `title-small` | 0.9375rem (15px) | 600 | 1.4 | 0.01em | Subheadline | Título de item de lista |
| `body-large` | 1rem (16px) | 400 | 1.5 | 0.01em | Body | Texto de lectura larga |
| `body-medium` | 0.875rem (14px) | 400 | 1.5 | 0.01em | Callout | Cuerpo por defecto de la app |
| `body-small` | 0.8125rem (13px) | 400 | 1.45 | 0.02em | Footnote | Texto de apoyo |
| `label-large` | 0.875rem (14px) | 600 | 1.3 | 0.02em | Body (bold) | Texto de botón |
| `label-medium` | 0.75rem (12px) | 600 | 1.3 | 0.03em | Caption 1 | Badges, chips, eyebrow |
| `label-small` | 0.6875rem (11px) | 600 | 1.3 | 0.04em | Caption 2 | Labels de bottom nav |

Números métricos siempre con `font-variant-numeric: tabular-nums` superpuesto sobre cualquier estilo de la tabla (crítico para KPIs, cronómetros y contadores animados).

### 3.2 Alias de componente (Capa 3)

```
--f7-comp-page-title        → headline-large
--f7-comp-section-title      → headline-small
--f7-comp-card-title         → title-medium
--f7-comp-list-item-title    → title-small
--f7-comp-body-default       → body-medium
--f7-comp-caption            → label-medium
--f7-comp-button-label       → label-large
--f7-comp-nav-label          → label-small
--f7-comp-metric-hero        → display-large + tabular-nums
```

---

## 4. Espaciado

Grid base de **4px**, agrupado en nombres semánticos (evita "magic numbers" en componentes) — reconcilia el grid de 4pt de M3 con el grid de 8pt que prefiere Apple usando 4 como unidad atómica y 8 como el "paso" más común:

| Token | Valor | Uso típico |
|---|---|---|
| `space-0` | 0px | — |
| `space-1` | 4px | Gap entre icono y label muy próximos |
| `space-2` | 8px | Gap entre chips, gap interno de icon+texto |
| `space-3` | 12px | Gap entre cards en lista (mobile) |
| `space-4` | 16px | Padding de pantalla mobile, padding de card estándar |
| `space-5` | 20px | Padding de card hero, gap entre cards (desktop) |
| `space-6` | 24px | Padding de card grande, gap entre grupos de Configuración |
| `space-8` | 32px | Gap entre secciones (H2 a H2) mobile, padding lateral desktop |
| `space-10` | 40px | Gap entre secciones desktop |
| `space-12` | 48px | Padding lateral desktop grande, alto de banner Perfil (mobile) |
| `space-16` | 64px | Alto de bottom nav / topbar |
| `space-20` | 80px | Espaciado hero excepcional |

Regla de *touch target* (HIG): cualquier elemento interactivo debe tener un área táctil mínima de **44×44px**, incluso si el elemento visual es más pequeño (ej. un icon-button de 24px visual lleva `padding` invisible hasta completar 44px de hitbox).

---

## 5. Elevación, sombra y materiales

Se combinan **dos sistemas de elevación** con propósitos distintos (no son intercambiables):

### 5.1 Elevación tonal (M3) — para superficies de contenido (cards)

En vez de sombra dura, subir de nivel = subir el contenedor a un `surface-container-*` más claro/diferenciado (ver §2.3). La sombra es un refuerzo sutil, no el mecanismo principal — así en modo oscuro "elevar" no depende de una sombra que no se percibe sobre negro.

| Nivel | Token | Superficie (claro) | Superficie (oscuro) | Sombra (solo claro) | Uso |
|---|---|---|---|---|---|
| 0 | `elevation-0` | container-lowest | container-lowest | ninguna | Fondo de pantalla |
| 1 | `elevation-1` | container-low | container-low | `0 1px 2px rgba(16,24,40,.04)` | Card en reposo |
| 2 | `elevation-2` | container | container | `0 2px 8px rgba(16,24,40,.06)` | Card hero, KPI card |
| 3 | `elevation-3` | container-high | container-high | `0 4px 16px rgba(16,24,40,.08)` | Card en hover/drag (desktop) |
| 4 | `elevation-4` | container-highest | container-highest | `0 8px 24px rgba(16,24,40,.10)` | Popover, dropdown |
| 5 | `elevation-5` | container-highest + borde | container-highest + glow | `0 16px 40px rgba(16,24,40,.14)` | Modal centrado (desktop) |

En **oscuro**, los niveles 3–5 añaden además un `outline` de 1px del color de acento contextual al 20–30% de opacidad en vez de intensificar sombra (sustituto del "glow" ya mencionado en `UX_DESIGN.md`).

### 5.2 Materiales (Apple HIG) — reservados para chrome flotante, no para cards de contenido

| Material | `backdrop-filter` | Fondo | Uso exclusivo |
|---|---|---|---|
| `material-thin` | `blur(16px)` | superficie @ 72% opacidad | Header sticky de mes en Historial/Calendario |
| `material-regular` | `blur(24px)` | superficie @ 80% opacidad | Bottom nav mobile, Topbar desktop |
| `material-thick` | `blur(32px)` | superficie @ 90% opacidad | Bottom sheet, modal mobile |

Regla: **una card de contenido nunca usa material/blur** (eso es exclusivo de elementos de navegación/overlay que flotan sobre contenido en movimiento, ej. al hacer scroll debajo del bottom nav).

---

## 6. Bordes y forma (Shape Scale)

| Token | Radio | Uso |
|---|---|---|
| `shape-none` | 0px | Tablas (celdas), separadores |
| `shape-xs` | 8px | Chips pequeños, inputs densos |
| `shape-sm` | 12px | Inputs, botones secundarios |
| `shape-md` | 16px | Botones primarios, badges grandes |
| `shape-lg` | 20px | Cards estándar |
| `shape-xl` | 28px | Cards hero, bottom sheets (esquinas superiores) |
| `shape-full` | 9999px | Píldoras, chips, avatares, FAB, switches |

Ancho de borde: `border-hairline` = 1px (divisores, outline de cards en oscuro), `border-thick` = 1.5px (estado focus/error de inputs), `border-selected` = 2px (selección activa: día del calendario, tema elegido en Configuración).

*Nota de continuidad ("squircle" Apple):* donde el diseño final lo justifique (iconos de app, avatares grandes, FAB), se puede sustituir `border-radius` por un `clip-path` de superelipse para lograr la curva "continua" característica de iOS — se documenta como *enhancement* opcional, no como requisito de la v1.

---

## 7. Sistema de grid y layout responsive

Fusiona las *window size classes* de M3 con nuestros breakpoints ya definidos en `UX_DESIGN.md §0.7`:

| Clase | Ancho | Columnas | Margen lateral | Gutter | Navegación |
|---|---|---|---|---|---|
| `compact` (mobile) | 0–599px | 4 | 16px | 12px | Bottom nav + FAB |
| `medium` (tablet) | 600–1023px | 8 | 24px | 16px | Bottom nav, grids 2 col |
| `expanded` (desktop) | 1024–1439px | 12 | 32px | 20px | Sidebar expandida |
| `large` (wide) | 1440–1919px | 12 | 48px | 24px | Sidebar + contenido centrado 1440px máx |
| `extra-large` | ≥1920px | 12 | auto (centrado) | 24px | Igual que `large`, más aire lateral |

Contenedor raíz: `max-width: 1440px`, `margin-inline: auto`, con el padding lateral de la tabla aplicado dentro de ese máximo.

---

## 8. Iconografía

- Sistema: outline de trazo variable (estilo Lucide/Material Symbols), **stroke 1.5px por defecto, 2px en tamaños ≤20px** (compensa pérdida de legibilidad a tamaño pequeño, igual que Apple ajusta el peso de SF Symbols en tamaños chicos).
- Estado activo/seleccionado: versión **filled** del mismo glifo + color de acento contextual (nunca un icono distinto — mismo glifo, dos "pesos").
- Escala de tamaño:

| Token | Tamaño | Uso |
|---|---|---|
| `icon-xs` | 14px | Inline junto a texto `label-medium` |
| `icon-sm` | 16px | Chips, badges |
| `icon-md` | 20px | Navegación, botones, cards |
| `icon-lg` | 24px | Headers de sección, iconos de estado |
| `icon-xl` | 32px | Accesos rápidos Dashboard, empty states |
| `icon-2xl` | 48px+ | Ilustraciones de estado vacío |

- Área táctil mínima siempre 44×44px independientemente del tamaño visual del glifo (ver §4).
- Grid de dibujo del icono: caja de 24×24 con `padding` interno de 2px (evita glifos que toquen el borde de su bounding box, estándar tanto de Material Symbols como de SF Symbols).

---

## 9. Componentes

### 9.1 Cards

Tres variantes (M3), elegidas por función, no por gusto:

| Variante | Fondo | Borde | Sombra | Uso |
|---|---|---|---|---|
| **Elevated** | `surface-container-low` | ninguno | `elevation-1→2` | Cards de contenido por defecto (Dashboard, Entrenamientos) |
| **Filled** | `surface-container-high` | ninguno | ninguna | Cards dentro de otra card (ej. mini-card de macro dentro de card de comida) |
| **Outlined** | `surface` | `1px outline-variant` | ninguna | Listas densas (Historial, Configuración) donde muchas cards seguidas harían "ruido" con sombra |

Anatomía estándar: `[icono/badge opcional] → [eyebrow label] → [título] → [contenido/valor] → [acción/chevron]`. Padding `space-4` (compacta) o `space-5` (hero). Radio `shape-lg` (`shape-xl` si es hero o bottom sheet).

Estados: `default`, `hover` (desktop: `elevation +1`, `translateY(-2px)`, 150ms), `pressed` (`scale(0.98)`), `selected` (borde `border-selected` color primary + fondo `primary-container` al 8%), `disabled` (opacidad 40%, sin interacción).

### 9.2 Botones

5 variantes M3 + mapeo a los 4 estilos de botón de Apple:

| Variante M3 | Fondo | Texto | Equivalente Apple | Uso |
|---|---|---|---|---|
| **Filled** | `color-primary` | `on-primary` | Prominent (`.borderedProminent`) | Acción principal única por pantalla ("Empezar entrenamiento") |
| **Tonal** | `secondary-container` | `on-secondary-container` | Bordered (gris) | Acción secundaria con peso medio |
| **Outlined** | transparente, borde `outline` | `color-on-surface` | Bordered (plain outline) | Acción secundaria de bajo énfasis |
| **Text** | transparente | `color-primary` | Plain | Acciones terciarias, links, "Ver más" |
| **Elevated** | `surface-container-low` + `elevation-1` | `color-primary` | Prominent sobre fondo de color | Sobre fondos de color/imagen (ej. banner de Perfil) |
| **Destructive** | transparente/`error-container` | `color-error` | Destructive | "Borrar datos", "Eliminar sesión" |

Tamaños: `button-sm` (altura 36px, `label-medium`, padding horizontal `space-3`), `button-md` (altura 44px — mínimo HIG, `label-large`, padding `space-4`), `button-lg` (altura 52px, usado en CTAs hero full-width). Radio: `shape-md` (botón estándar) / `shape-full` (FAB, botones tipo píldora en chips de acción rápida).

Estados: `hover` (desktop: oscurecer/aclarar fondo 8%), `pressed` (`scale(0.97)`, spring snappy), `focus-visible` (anillo de foco 2px `color-primary` offset 2px — accesibilidad de teclado, no opcional), `disabled` (opacidad 38%, sin sombra), `loading` (label reemplazado por spinner de 16px, mismo tamaño de botón para evitar salto de layout).

**FAB:** círculo `56px` (`shape-full`), variante `filled` únicamente, icono `icon-md` centrado, `elevation-3`, posición fija `bottom: space-4 + safe-area / right: space-4`.

### 9.3 Inputs / Text fields

Variante única (por consistencia): **Outlined** (mejor que Filled para tema oscuro — un fondo relleno adicional sobre `surface` ya oscuro reduce contraste).

Anatomía: label flotante (`label-medium`, se encoge y sube al borde superior al enfocar/tener valor — patrón M3), campo de texto `body-medium`, icono opcional a la izquierda (`icon-md`), icono de acción/clear a la derecha, texto de ayuda o error debajo (`body-small`).

| Estado | Borde | Color de label |
|---|---|---|
| Default | `outline`, 1px | `on-surface-variant` |
| Focus | `color-primary`, 1.5px + leve glow/ring | `color-primary` |
| Error | `color-error`, 1.5px | `color-error` |
| Disabled | `outline-variant`, 1px, fondo `surface-container-lowest` | `on-surface-variant` @ 38% |

Altura estándar 48px (cumple touch target con margen), radio `shape-sm`. Variantes especiales: `search-field` (siempre `shape-full`, icono de lupa fijo a la izquierda, usado en Biblioteca/Historial), `textarea` (radio `shape-md`, altura mínima 96px, resize vertical únicamente).

### 9.4 Badges

| Tipo | Forma | Contenido | Uso |
|---|---|---|---|
| **Dot badge** | círculo 8px | ninguno | Notificación sin contar (campana en Dashboard) |
| **Numeric badge** | píldora, mín. 18px alto | número (99+ tope) | Contador de notificaciones |
| **Status badge** | píldora, `label-medium`, padding `space-2`/`space-1` | texto corto ("Completado", "En curso", "Pendiente") | Estado de sesión, estado de lesión |

Color de status badge = color extendido de dominio correspondiente (container de fondo + on-container de texto, nunca color sólido saturado de fondo — mantiene legibilidad y coherencia con el resto del sistema de superficies).

### 9.5 Chips

4 variantes M3, todas `shape-full`, altura 32–36px:

| Variante | Uso |
|---|---|
| **Assist** | Acción sugerida contextual (ej. "Añadir a sesión" flotante sobre un ejercicio de Biblioteca) |
| **Filter** | Selección múltiple con toggle (categorías en Biblioteca, tipos de evento en Calendario) — estado activo: fondo `secondary-container`, icono de check a la izquierda |
| **Input** | Representa una entrada eliminable (ej. "Piernas ✕" en el selector de dolor muscular de Recuperación) |
| **Suggestion** | Sugerencia dinámica, tap para aplicar (tips de nutrición como acceso rápido) |

### 9.6 Tablas

Uso: vistas densas en desktop (Historial en modo tabla, comparación de jugadores en Estadísticas — rol coach).

- Fila de encabezado: `label-medium` uppercase, `on-surface-variant`, fondo `surface-container-low`, altura 40px, ordenable (icono de flecha aparece on-hover, se fija al ordenar activo).
- Filas de datos: altura 48px (densidad "comfortable") o 40px (densidad "compact", toggle disponible), `body-medium`, divisor `outline-variant` 1px entre filas, **sin** zebra-striping (compite visualmente con los colores semánticos de las celdas de estado) — en su lugar, `hover` de fila usa `surface-container-high`.
- Celda numérica: alineación derecha, `tabular-nums`.
- Celda de estado: usa Status Badge (§9.4), no texto plano coloreado.
- Fila seleccionada (comparación de jugadores): fondo `primary-container` @ 12%, borde izquierdo 3px `color-primary`.

### 9.7 Gráficos (tokens para Chart.js)

Config compartida (`chartTheme.js` referenciado en `ARCHITECTURE.md`) que lee estos tokens en vez de hardcodear color:

| Token de chart | Claro | Oscuro |
|---|---|---|
| `chart-grid` | Neutral/92 | Neutral/24 |
| `chart-axis-label` | `on-surface-variant` | `on-surface-variant` |
| `chart-tooltip-bg` | `inverse-surface` | `inverse-surface` |
| `chart-tooltip-text` | `inverse-on-surface` | `inverse-on-surface` |
| `chart-series-1..5` | Primary/60, Technical, Tactical, Nutrition, Match | mismas, +8% saturación |
| `chart-area-fill-opacity` | 0.16 | 0.10 |
| `chart-radar-fill-opacity` | 0.20 (serie A) / 0.12 (serie B) | 0.24 / 0.14 |

Tipografía de ejes/leyenda: `label-small`. Animación: `easeOutQuart`, 700ms (coherente con `motion.duration.slow` de `UX_DESIGN.md §0.6`).

---

## 10. Bloque de referencia — Variables CSS

Especificación canónica de la Capa 2 (system tokens) como custom properties. Prefijo `--f7-` para namespacing.

```css
:root[data-theme="light"] {
  /* Color — roles principales */
  --f7-color-primary: #D4FF3F;
  --f7-color-on-primary: #1A2100;
  --f7-color-primary-container: #E9FF8F;
  --f7-color-on-primary-container: #1A2100;

  --f7-color-secondary: #254E7D;
  --f7-color-on-secondary: #FFFFFF;
  --f7-color-secondary-container: #D2E3F5;
  --f7-color-on-secondary-container: #0A1830;

  --f7-color-tertiary: #544096;
  --f7-color-on-tertiary: #FFFFFF;
  --f7-color-tertiary-container: #DBD5FD;

  --f7-color-error: #A82824;
  --f7-color-on-error: #FFFFFF;
  --f7-color-error-container: #FFD5D6;

  --f7-color-background: #F7F8FA;
  --f7-color-on-background: #12151A;

  --f7-color-surface-container-lowest: #FFFFFF;
  --f7-color-surface-container-low: #F7F8FA;
  --f7-color-surface-container: #F5F6F8;
  --f7-color-surface-container-high: #F1F3F5;
  --f7-color-surface-container-highest: #EDEFF2;

  --f7-color-on-surface: #12151A;
  --f7-color-on-surface-variant: #6B7280;
  --f7-color-outline: #E7E9EC;
  --f7-color-outline-variant: #F1F3F5;

  /* Dominio */
  --f7-color-physical: #FF8A3D;
  --f7-color-technical: #2F8FFF;
  --f7-color-tactical: #8B6DF2;
  --f7-color-recovery: #8B7CF6;
  --f7-color-nutrition: #FFB020;
  --f7-color-match: #12B76A;

  /* Sombra (solo claro) */
  --f7-shadow-1: 0 1px 2px rgba(16,24,40,.04);
  --f7-shadow-2: 0 2px 8px rgba(16,24,40,.06);
  --f7-shadow-3: 0 4px 16px rgba(16,24,40,.08);
  --f7-shadow-4: 0 8px 24px rgba(16,24,40,.10);
  --f7-shadow-5: 0 16px 40px rgba(16,24,40,.14);
}

:root[data-theme="dark"] {
  --f7-color-primary: #D4FF3F;
  --f7-color-on-primary: #1A2100;
  --f7-color-primary-container: #3F4F00;
  --f7-color-on-primary-container: #E9FF8F;

  --f7-color-secondary: #9CBEE6;
  --f7-color-on-secondary: #122842;
  --f7-color-secondary-container: #1B3A5E;
  --f7-color-on-secondary-container: #D2E3F5;

  --f7-color-tertiary: #B3A9FA;
  --f7-color-on-tertiary: #2B1D54;
  --f7-color-tertiary-container: #3F2E75;

  --f7-color-error: #FF9B9E;
  --f7-color-on-error: #5C1210;
  --f7-color-error-container: #821D1B;

  --f7-color-background: #0B0E11;
  --f7-color-on-background: #F5F6F8;

  --f7-color-surface-container-lowest: #0B0E11;
  --f7-color-surface-container-low: #12151A;
  --f7-color-surface-container: #171B21;
  --f7-color-surface-container-high: #1F242C;
  --f7-color-surface-container-highest: #2A3038;

  --f7-color-on-surface: #F5F6F8;
  --f7-color-on-surface-variant: #9AA3AF;
  --f7-color-outline: #2A3038;
  --f7-color-outline-variant: #1F242C;

  --f7-color-physical: #FF9D5C;
  --f7-color-technical: #57A6FF;
  --f7-color-tactical: #A38BF9;
  --f7-color-recovery: #A79AF8;
  --f7-color-nutrition: #FFC24D;
  --f7-color-match: #2FD98A;

  /* En oscuro no hay shadow, hay borde/glow — ver §5.1 */
  --f7-shadow-1: none;
  --f7-shadow-2: none;
  --f7-shadow-3: none;
  --f7-shadow-4: none;
  --f7-shadow-5: none;
  --f7-glow-accent: 0 0 0 1px color-mix(in srgb, var(--f7-color-primary) 30%, transparent);
}

:root {
  /* Espaciado */
  --f7-space-1: 4px;  --f7-space-2: 8px;  --f7-space-3: 12px;
  --f7-space-4: 16px; --f7-space-5: 20px; --f7-space-6: 24px;
  --f7-space-8: 32px; --f7-space-10: 40px; --f7-space-12: 48px;
  --f7-space-16: 64px; --f7-space-20: 80px;

  /* Forma */
  --f7-shape-xs: 8px;  --f7-shape-sm: 12px; --f7-shape-md: 16px;
  --f7-shape-lg: 20px; --f7-shape-xl: 28px; --f7-shape-full: 9999px;
  --f7-border-hairline: 1px;
  --f7-border-thick: 1.5px;
  --f7-border-selected: 2px;

  /* Tipografía — tamaños base (rem, escalan con Dynamic Type) */
  --f7-type-display-lg: 2.5rem;   --f7-type-display-md: 2.25rem; --f7-type-display-sm: 2rem;
  --f7-type-headline-lg: 1.75rem; --f7-type-headline-md: 1.5rem; --f7-type-headline-sm: 1.25rem;
  --f7-type-title-lg: 1.125rem;   --f7-type-title-md: 1rem;      --f7-type-title-sm: 0.9375rem;
  --f7-type-body-lg: 1rem;        --f7-type-body-md: 0.875rem;   --f7-type-body-sm: 0.8125rem;
  --f7-type-label-lg: 0.875rem;   --f7-type-label-md: 0.75rem;   --f7-type-label-sm: 0.6875rem;
  --f7-font-heading: "Sora", ui-sans-serif, system-ui, sans-serif;
  --f7-font-body: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Motion (coherente con UX_DESIGN.md §0.6) */
  --f7-duration-fast: 140ms;
  --f7-duration-base: 250ms;
  --f7-duration-slow: 800ms;
  --f7-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --f7-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Iconografía */
  --f7-icon-xs: 14px; --f7-icon-sm: 16px; --f7-icon-md: 20px;
  --f7-icon-lg: 24px; --f7-icon-xl: 32px; --f7-icon-2xl: 48px;
  --f7-touch-target-min: 44px;

  /* Grid */
  --f7-container-max: 1440px;
  --f7-gutter-compact: 12px; --f7-gutter-medium: 16px; --f7-gutter-expanded: 20px;
  --f7-margin-compact: 16px; --f7-margin-medium: 24px; --f7-margin-expanded: 32px;
}
```

### Mapeo a Tailwind (referencia, no implementación)

En `tailwind.config.js`, `theme.extend.colors/spacing/borderRadius/fontSize` deben apuntar a estas mismas variables (`var(--f7-color-primary)`, etc.) en vez de duplicar valores hex — así el toggle de tema (`data-theme` en `<html>`) recolorea Tailwind y Chart.js simultáneamente sin recompilar CSS, exactamente como especifica `ARCHITECTURE.md §9`.

---

## 11. Checklist de cumplimiento (M3 + HIG) antes de dar por cerrado un componente

- [ ] ¿Usa solo component tokens (Capa 3), nunca hex directo?
- [ ] ¿Contraste texto/fondo ≥ 4.5:1 en ambos temas (WCAG AA)?
- [ ] ¿Área táctil ≥ 44×44px aunque el elemento visual sea menor?
- [ ] ¿Tiene estado `focus-visible` explícito (no solo hover)?
- [ ] ¿La tipografía usa `rem` (Dynamic Type-safe), no `px`?
- [ ] ¿La elevación en oscuro usa borde/glow y no una sombra oscura invisible?
- [ ] ¿Los colores de dominio (físico/técnico/táctico/...) son consistentes con `UX_DESIGN.md §11`?
- [ ] ¿La animación de entrada usa los tokens de `--f7-duration-*` / `--f7-ease-*` en vez de valores sueltos?

Este documento, junto con `ARCHITECTURE.md` y `UX_DESIGN.md`, cierra la trilogía de especificación previa a codificar: arquitectura de software, experiencia de usuario y sistema de diseño.
