# F7 Performance Pro — Diseño de Experiencia de Usuario (UX/UI)

**Versión:** 1.0 — especificación visual, sin código
**Referencia de nivel:** Apple Fitness, Garmin Connect, Nike Training Club
**Complementa a:** `docs/ARCHITECTURE.md`

Este documento define la estructura visual completa de la aplicación: cada pantalla, cada elemento, su posición, comportamiento y motion design. Es el contrato visual que debe seguir la implementación.

> Nota de alcance: además de las pantallas del set original (Dashboard, Calendario, Estadísticas, Configuración), esta especificación incorpora **Entrenamientos, Nutrición, Recuperación, Biblioteca, Perfil e Historial** como pantallas de primer nivel — cada una mapea a un feature nuevo o existente dentro de `src/features/` (`nutrition/`, `recovery/`, `library/`, `history/` se añaden como features nuevos siguiendo el mismo patrón ya definido en la arquitectura).

---

## 0. Fundamentos del sistema de diseño

Todo lo que aparece en cada pantalla hereda de estos fundamentos. Se definen una sola vez para garantizar consistencia (y para que Tailwind/Chart.js/Framer Motion lean de la misma fuente, como ya especifica `ARCHITECTURE.md §9`).

### 0.1 Tipografía

Fuente: geométrica sans-serif de alto rendimiento visual (tipo *Inter* / *Sora* para titulares, *Inter* para cuerpo). Números siempre con `tabular-nums` (evita que las cifras "bailen" al animarse — crítico en dashboards con contadores).

| Rol | Tamaño | Peso | Uso |
|---|---|---|---|
| Display | 34–40px | 800 (Extrabold) | Números hero (kcal, puntuación de recuperación) |
| H1 — Título de pantalla | 26–28px | 700 (Bold) | "Dashboard", "Entrenamientos" |
| H2 — Título de sección | 18–20px | 600 (Semibold) | "Esta semana", "Progreso reciente" |
| H3 — Título de card | 15–16px | 600 (Semibold) | Nombre de sesión, nombre de alimento |
| Body | 14–15px | 400–500 | Texto descriptivo, listas |
| Caption / eyebrow | 11–12px | 600, uppercase, tracking +0.06em | Etiquetas de categoría ("FÍSICO", "HOY") |
| Métrica inline | 13–14px | 700, tabular-nums | "42 km/h", "+3.2%" |

Jerarquía general de lectura: **eyebrow (categoría) → título → métrica destacada → texto de apoyo**. Nunca más de 2 pesos de fuente distintos dentro de una misma card.

### 0.2 Paleta de color

**Marca / acento primario:** *F7 Volt* — verde lima energético `#D4FF3F` (inspirado en Nike Volt), reservado para CTAs primarios, anillos de progreso activos, estados "activo/seleccionado". Se usa con moderación — es el color que "grita", no el color de fondo.

**Acentos semánticos por dominio** (para que el usuario asocie color↔contexto en toda la app, como los anillos de Apple Fitness):

| Dominio | Color | Hex (referencia) | Uso |
|---|---|---|---|
| Entrenamiento físico | Naranja | `#FF8A3D` | Sesiones físicas, carga de entrenamiento |
| Entrenamiento técnico | Azul | `#2F8FFF` | Sesiones técnicas, estadísticas de rendimiento |
| Entrenamiento táctico | Morado | `#8B7CF6` | Sesiones tácticas |
| Recuperación | Lavanda/Índigo | `#8B7CF6` → `#5EEAD4` (gradiente) | Sueño, HRV, puntuación de recuperación |
| Nutrición | Ámbar | `#FFB020` | Calorías, macros, hidratación |
| Partidos / competición | Verde esmeralda | `#12B76A` | Resultados, victorias |
| Alertas / lesiones | Coral | `#FF5A5F` | Estados negativos, lesiones activas, errores |
| Neutro/estructura | Grises | ver abajo | Fondos, texto secundario, bordes |

**Tema claro:**
- Fondo base `#F7F8FA`, superficie de card `#FFFFFF`, borde sutil `#E7E9EC`, texto primario `#12151A`, texto secundario `#6B7280`, sombra `rgba(16,24,40,0.06)` difusa (blur 20–24px, sin offset agresivo).

**Tema oscuro:**
- Fondo base `#0B0E11`, superficie de card `#171B21`, superficie elevada `#1F242C`, borde sutil `#2A3038`, texto primario `#F5F6F8`, texto secundario `#9AA3AF`. **Sin sombras** (no se leen sobre negro) — la elevación se comunica con borde de 1px + un leve *glow* interior del color de acento cuando la card está activa/seleccionada, nunca con `box-shadow` oscuro.
- Los colores de acento se saturan ligeramente más en dark mode (+5–8% saturación) para compensar la pérdida de contraste percibido sobre fondo oscuro.

Regla transversal: el **color de acento nunca es el color de fondo de una pantalla completa** — se usa en anillos, iconos activos, barras de progreso, bordes de selección y texto de énfasis. El fondo siempre es neutro.

### 0.3 Espaciado

Escala base de 4px: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`.

- Padding de pantalla (mobile): `16px` laterales, `12px` superior bajo el header.
- Padding de pantalla (desktop): `32–48px` laterales, contenido centrado con `max-width: 1440px`.
- Padding interno de card: `16px` (cards compactas) / `20–24px` (cards hero).
- Gap entre cards en lista: `12px` mobile, `16–20px` desktop.
- Gap entre secciones (H2 a H2): `32px` mobile, `40px` desktop.
- Altura de bottom nav: `64px` + safe-area-inset-bottom (notch).
- Altura de topbar desktop: `64px`.

### 0.4 Forma, elevación e iconografía

- Radio de esquina: cards `20px` (rounded-2xl), botones `12–14px`, chips/badges/avatares `full` (píldora/círculo), inputs `12px`.
- Iconos: set outline consistente (estilo Lucide/Feather), stroke `1.5–2px`. Tamaño `20px` en navegación, `18px` inline junto a texto, `16px` en badges/chips. **Estado activo = versión filled/duotono del mismo icono + color de acento**, replicando el patrón de tab bar de iOS (outline inactivo, filled activo).
- Elevación (light): `sm` para cards en reposo, `md` al hacer hover/drag (desktop), `lg` reservada para modales/sheets.
- Elevación (dark): border `1px solid` + glow opcional, nunca sombra oscura.

### 0.5 Navegación global

**Mobile (< 640px):** Bottom Tab Bar fija con 5 destinos principales — **Inicio · Entrenar · Calendario · Estadísticas · Perfil** — icono + label 11px, indicador activo = icono filled + color de acento + un punto/pill animado detrás del icono (`layoutId` compartido en Framer Motion para que el indicador "se deslice" entre tabs). Nutrición, Recuperación, Biblioteca, Historial y Configuración se acceden desde accesos rápidos del Dashboard y desde el menú del Perfil, para no saturar la barra (principio de Garmin Connect: 5 tabs máximo en móvil).

**Tablet (640–1024px):** Igual bottom nav, pero layouts internos pasan a 2 columnas.

**Desktop (> 1024px):** Sidebar izquierda fija y colapsable (72px colapsada solo-iconos / 240px expandida con labels), agrupada por secciones:
```
PRINCIPAL       Inicio · Entrenamientos · Calendario · Estadísticas
BIENESTAR       Nutrición · Recuperación
RECURSOS        Biblioteca · Historial
CUENTA          Perfil · Configuración
```
Topbar superior con: breadcrumb/título de sección, buscador global (icono lupa → expande input), toggle de tema (sol/luna, animado), avatar del usuario (abre menú: Perfil / Configuración / Cerrar sesión).

### 0.6 Principios de animación (Framer Motion)

| Token | Valor | Uso |
|---|---|---|
| `duration.fast` | 120–150ms | Feedback de tap/hover, toggles |
| `duration.base` | 220–280ms | Transiciones de página, aparición de cards |
| `duration.slow` | 600–900ms | Anillos de progreso, gráficos, gauges |
| `easing.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas (elementos que aparecen) |
| `easing.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transiciones de página |
| `spring.snappy` | stiffness 400 / damping 30 | Botones, toggles, drag |

Patrones estándar reutilizados en toda la app:
- **Entrada de listas:** fade + translateY(12px)→0, stagger 40–60ms entre items.
- **Transición de página:** fade + translateY(8px), sin "slide lateral" agresivo (excepto calendario, que sí desliza horizontalmente al cambiar de mes, replicando el gesto físico de "pasar página").
- **Tap en botón/card:** `scale(0.97)` con spring snappy, vuelve a 1 al soltar.
- **Progreso (anillos, barras, gauges):** dibujo animado desde 0 al valor real, 700–1000ms `easing.out`, nunca instantáneo — es la firma visual de la app (igual que Apple Activity).
- **Números (KPIs):** count-up animado 500–700ms al montar/cambiar de rango.
- **Modales (desktop):** fade + scale(0.96→1) centrado. **Bottom sheets (mobile):** slide-up desde el borde inferior con backdrop fade, drag-to-dismiss habilitado.
- **Toasts:** slide-up + fade desde borde inferior (mobile) / esquina superior derecha (desktop), auto-dismiss 3–4s con barra de progreso sutil.
- **Skeletons:** shimmer horizontal en loop mientras `status === 'loading'`, nunca spinners genéricos salvo en acciones puntuales (guardar, enviar).

### 0.7 Responsive — reglas generales

| Breakpoint | Rango | Columnas de grid | Navegación |
|---|---|---|---|
| `mobile` | < 640px | 1 col (listas apiladas) | Bottom nav + FAB |
| `tablet` | 640–1024px | 2 cols | Bottom nav (o sidebar colapsada en landscape) |
| `desktop` | 1024–1440px | 3 cols | Sidebar expandida |
| `wide` | > 1440px | 3–4 cols, contenido centrado | Sidebar expandida, más aire lateral |

Hover states (`scale-102` + elevación) **solo se activan en desktop** (`@media (hover: hover)`), nunca en touch.

---

## 1. Dashboard (Inicio)

### Objetivo UX
Snapshot diario: cómo está el usuario hoy, qué toca entrenar, cómo va su progreso — la pantalla que responde "¿qué hago ahora?" en menos de 3 segundos de lectura.

### Layout — Mobile
```
┌─────────────────────────────┐
│  Buenos días, Leo   🔔  ⚪   │  ← header
│  Martes, 22 de julio          │
├─────────────────────────────┤
│      ⭕ Anillos de hoy        │  ← hero: 3 anillos concéntricos
│   Carga · Recuperación ·      │     animados + resumen central
│   Objetivo semanal            │
├─────────────────────────────┤
│ 🔥5 días │ ⚽12 │ 📅Vie 18:00 │  ← chips de stats (scroll horiz.)
├─────────────────────────────┤
│  HOY                          │
│  ┌───────────────────────┐   │  ← card hero "sesión de hoy"
│  │ Entrenamiento técnico  │   │
│  │ 18:00 · 75 min          │   │
│  │ [ Empezar entrenamiento]│   │
│  └───────────────────────┘   │
├─────────────────────────────┤
│  ESTA SEMANA                  │
│  L  M  X  J  V  S  D          │  ← tira de 7 días, hoy resaltado
├─────────────────────────────┤
│  PROGRESO RECIENTE            │
│  ┌───────────────────────┐   │  ← mini line chart + link
│  └───────────────────────┘   │
├─────────────────────────────┤
│  RECUPERACIÓN                 │
│  ┌──── gauge 0–100 ─────┐    │
├─────────────────────────────┤
│  ACCESOS RÁPIDOS              │
│  🍎Nutrición  📚Biblioteca    │  ← grid 2x2
│  🕐Historial  ⚙️Config        │
└─────────────────────────────┘
                          [+]FAB
```

### Layout — Desktop/Tablet
Grid de 3 columnas bajo el header: **Col A** (anillos + racha, sticky), **Col B** (card "hoy" + tira semanal + progreso reciente), **Col C** (gauge de recuperación + próximos eventos del calendario + accesos rápidos en lista vertical). Header ocupa el ancho completo con buscador centrado añadido (no presente en mobile).

### Posición y jerarquía visual
Orden de lectura (Z-pattern): saludo → anillos (elemento más grande y animado, ancla visual) → card "hoy" (segunda prioridad, con CTA) → resto en scroll. El anillo central siempre gana peso visual frente a las cards inferiores: es el único elemento circular grande de toda la pantalla.

### Cards
- **Card de anillos (hero):** fondo superficie, sin borde marcado, anillos SVG concéntricos (grosor 10–12px, cap redondeado), centro con número grande + label. Altura ~220px mobile.
- **Chips de stats:** píldoras `rounded-full`, altura 36px, scroll horizontal con `snap-x`, cada una: icono 16px + valor bold + label pequeño.
- **Card "Hoy":** la única card con fondo de color de acento suave (tinte del color del tipo de sesión al 8–10% de opacidad sobre superficie), borde 1px del mismo tono, badge de categoría arriba a la izquierda, CTA primario ancho completo abajo.
- **Card "Progreso reciente":** sparkline a la derecha, valor+delta a la izquierda, toda la card es tappable (navega a Estadísticas).
- **Card de recuperación:** gauge semicircular, colorcoded, texto de estado ("Óptima") debajo.
- **Accesos rápidos:** grid 2x2 de mini-cards cuadradas, icono grande centrado + label, fondo neutro, hover/tap eleva.

### Botones
- Primario: `Empezar entrenamiento` — fondo Volt `#D4FF3F`, texto casi-negro (`#12151A`, nunca blanco sobre Volt por contraste), full-width en card, altura 48px, `rounded-full`.
- FAB: círculo 56px, esquina inferior derecha, fondo Volt, icono `+` blanco/negro según tema, sombra flotante (light) / glow (dark). Al tap abre bottom sheet: "Nueva sesión / Registrar comida / Check-in de recuperación".
- Icon buttons (campana, avatar): 40px táctil, sin fondo, ripple sutil al tap.

### Iconos
`Flame` (racha), `Dumbbell`/`Calendar`/`BarChart2` en chips, `Bell` (notificaciones), iconos de dominio por tipo de sesión (ver §0.2), `Apple`/`Utensils` (nutrición), `Moon`/`BatteryCharging` (recuperación), `BookOpen` (biblioteca), `History`, `Settings`.

### Gráficos
- Anillos concéntricos (custom SVG, no Chart.js — necesitan control fino de animación y superposición de 3 anillos).
- Sparkline dentro de "Progreso reciente": `LineChart` de Chart.js sin ejes visibles, solo la curva y un punto final destacado.
- Gauge semicircular de recuperación: `DoughnutChart` de Chart.js configurado a 180° con `cutout` alto, o SVG custom con gradiente condicional por rango de valor.

### Tipografía
Saludo `H1 28px/700`; fecha `caption 13px` gris; número central del anillo `Display 36px/800 tabular-nums`; labels de anillo `caption uppercase`; título de card "Hoy" `H3 16px/600`; hora/duración `body 14px` secundario.

### Espaciados
Header padding `16px 16px 8px`; gap entre secciones `32px`; padding interno cards `20px`; gap chips `8px`.

### Tema oscuro
Anillos sobre fondo `#171B21`, tracks de fondo del anillo en `#232933` (no negro puro, para que se perciba el "surco"). Gauge de recuperación con glow sutil del color resultante.

### Tema claro
Anillos con track de fondo `#EDEFF2`; sombra difusa bajo la card hero de "Hoy".

### Responsive
Mobile: todo apilado, scroll vertical único. Desktop: 3 columnas simultáneas visibles sin scroll para el "above the fold" principal (anillos + hoy + recuperación visibles sin scrollear).

### Animaciones y microinteracciones
Anillos se dibujan secuencialmente (exterior→interior, 150ms de delay entre cada uno) al montar la pantalla; icono de racha 🔥 tiene un loop de pulso sutil (`scale 1↔1.05`, 2s, infinito, solo si racha ≥ 3 días); tira semanal con snap-scroll que autocentra "hoy" al entrar; tap en card "Hoy" → scale down + navegación con fade; contador de KPIs (chips) cuenta desde 0 la primera vez que se ve la pantalla en la sesión.

### Estados
Loading: skeleton de anillos (círculo shimmer) + skeleton de cards rectangulares. Empty (sin sesión hoy): card "Hoy" se reemplaza por estado "Día de descanso 😌" con ilustración ligera y sugerencia de recuperación activa.

---

## 2. Entrenamientos

### Objetivo UX
Gestionar y ejecutar sesiones de entrenamiento: ver próximas, revisar completadas, empezar la de hoy, registrar asistencia y ejercicios.

### Layout — Mobile
```
┌─────────────────────────────┐
│  Entrenamientos      🔍  ⋮   │
│  [Próximos|Completados|Plant]│ ← segmented control
├─────────────────────────────┤
│ ┌─ Jue 24 ───────────────┐  │ ← session card
│ │ 🟠 Físico · 60 min       │  │
│ │ Resistencia y fuerza     │  │
│ │ 👥 14 convocados          │  │
│ └───────────────────────┘  │
│ ┌─ Vie 25 ───────────────┐  │
│ │ 🔵 Técnico · 75 min      │  │
│ │        [ Empezar ]       │  │ ← CTA solo si es la de hoy
│ └───────────────────────┘  │
└─────────────────────────────┘
                          [+]FAB
```
Detalle de sesión (al tap): header con back + título + menú (editar/duplicar/eliminar), fila de stats (duración, tipo, intensidad prevista), lista de ejercicios en acordeón, grid de asistencia (avatares circulares, tap alterna presente/ausente con anillo de color), notas, botón flotante inferior "Finalizar sesión".

### Layout — Desktop
Vista maestro-detalle: panel izquierdo (lista, 360px) + panel derecho (detalle de la sesión seleccionada), como Mail/Notion. Toggle arriba a la derecha para cambiar a "vista calendario" (grid semanal con sesiones como bloques).

### Posición y jerarquía visual
El segmented control domina la parte superior (filtra todo lo demás). Dentro de la lista, la sesión de **hoy** se distingue con borde de acento + badge "HOY" — jerárquicamente por encima del resto aunque no esté primera cronológicamente si ya pasó la hora de otra.

### Cards
Session card: badge de fecha a la izquierda (número grande + mes abreviado, columna fija 48px), barra de color lateral izquierda indicando tipo (naranja/azul/morado/lavanda), contenido central (tipo+duración eyebrow, título, submeta), avatar-stack de asistencia a la derecha (máx 4 avatares + "+n"), badge de estado esquina superior derecha (Pendiente gris / En curso Volt animado / Completado verde con check).

### Botones
Primario `Empezar` (solo visible en sesión de hoy no iniciada) — mismo estilo que Dashboard. Botón secundario outline `Finalizar sesión` en el detalle. Icon button `⋮` menú contextual (editar/duplicar/eliminar) con dropdown/bottom sheet. Checkbox circular por ejercicio (se convierte en check verde animado al completar).

### Iconos
Icono de tipo de sesión (mancuerna=físico, balón=técnico, tablero táctico=táctico, luna=recuperación), `Users` (asistencia), `Clock` (duración), `MoreVertical` (menú), `Plus` (FAB/añadir ejercicio).

### Gráficos
En el detalle de sesión completada: mini `BarChart` de RPE (esfuerzo percibido) por ejercicio, y comparación duración planificada vs real.

### Tipografía
Título de sesión `H3 16/600`; badge de fecha número `20/700`; eyebrow tipo+duración `caption uppercase`; nombre de ejercicio en acordeón `body 15/500`.

### Espaciados
Cards con `padding 16px`, gap vertical `12px`; barra lateral de color `4px` de ancho a todo el alto de la card.

### Tema oscuro
Barra lateral de color sube ligeramente de saturación; badge "En curso" usa glow pulsante en vez de sombra.

### Tema claro
Avatares con borde blanco `2px` para separarse visualmente del stack.

### Responsive
Mobile: acordeón de ejercicios ocupa todo el ancho. Desktop: ejercicios en tabla con columnas (Ejercicio | Series | Reps/Duración | Objetivo) en vez de acordeón, más denso.

### Animaciones y microinteracciones
Segmented control con indicador que se desliza (`layoutId`) entre "Próximos/Completados/Plantillas"; swipe-left en card (mobile) revela acciones rápidas (editar/eliminar) con resistencia elástica; al marcar ejercicio completo, el checkbox hace un morph círculo→check con leve "bounce" y la fila baja opacidad al 70%; al finalizar sesión, transición de card de "En curso" (glow pulsante) a "Completado" con cross-fade de badge.

### Estados
Empty en "Completados" (temporada nueva): ilustración + "Aún no has completado entrenamientos". Loading: skeleton de 3 session cards.

---

## 3. Calendario

### Objetivo UX
Visión temporal de todo (entrenamientos, partidos, evaluaciones) en mes/semana/día, con navegación fluida.

### Layout — Mobile
```
┌─────────────────────────────┐
│  ←  Julio 2026  →   Hoy  +  │
│  [ Mes | Semana | Día ]      │ ← segmented view toggle
├─────────────────────────────┤
│ L  M  X  J  V  S  D          │
│ 29 30  1  2  3  4  5         │
│  •  •     •                  │ ← dots de eventos bajo el número
│  6  7  8 (9) 10 11 12         │ ← hoy con círculo relleno
├─────────────────────────────┤
│  Martes, 9 de julio           │
│  ┌───────────────────────┐  │ ← agenda del día seleccionado
│  │ ▎18:00 Entren. técnico │  │
│  │ ▎20:30 Partido vs. XYZ │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```
Vista Semana/Día: timeline vertical con marcas de hora (cada hora, `48px` de alto por hora), bloques de evento posicionados/dimensionados por duración, línea roja de "ahora" cruzando la columna.

### Layout — Desktop
Grid de mes a la izquierda (más grande, celdas `~120px`), panel de agenda persistente a la derecha (no colapsa a "debajo"), con lista de eventos del día seleccionado y detalle inline al hacer click.

### Posición y jerarquía visual
El número del día es el elemento tipográficamente más fuerte de cada celda; los "dots" de evento son secundarios (color, no texto); el día seleccionado y "hoy" son las dos únicas celdas con fondo sólido (distinto entre sí: hoy = borde Volt, seleccionado = fondo neutro elevado).

### Cards
Agenda item: barra de color lateral por tipo, hora en columna fija ancho `56px`, icono+título, chevron derecho. Legend chip row arriba de la agenda: `Entrenamiento / Partido / Evaluación / Otro`, tappable para mostrar/ocultar tipo (toggle con opacidad).

### Botones
Chevrons `←/→` de navegación de mes (icon button 32px), botón `Hoy` (texto, sin fondo, color acento), `+` icon button abre bottom sheet "Nuevo evento" con selector de tipo.

### Iconos
`ChevronLeft/Right`, `Plus`, iconos de tipo de evento heredados de Entrenamientos + `Trophy`/`Shield` para partidos, `ClipboardCheck` para evaluaciones.

### Gráficos
No hay charts de datos aquí (es una vista temporal), salvo un mini indicador de "densidad de carga semanal" opcional como barra de calor debajo del selector de vista (7 segmentos coloreados por volumen de esa semana).

### Tipografía
Mes/año header `H1 22/700`; número de día `body 14/500`, `20/700` si es hoy; hora en agenda `caption 12/600 tabular-nums`.

### Espaciados
Celdas de grid con `4px` de gap; agenda items `padding 12px 16px`, gap `8px`.

### Tema oscuro
Dots de evento suben brillo; línea de "ahora" en rojo coral con glow leve para destacar sobre fondo oscuro.

### Tema claro
Celda de "hoy" con anillo `2px` color Volt sobre fondo blanco.

### Responsive
Mobile: mes grid compacto (números pequeños, solo dots). Tablet/desktop: celdas más grandes que pueden mostrar hasta 2 títulos de evento truncados directamente dentro de la celda (como Google Calendar), no solo dots.

### Animaciones y microinteracciones
Cambio de mes desliza el grid completo horizontalmente (izquierda↔derecha según dirección), con swipe gesture soportado en mobile; selección de día = scale-pop breve de la celda + fade-in de la agenda inferior; línea de "ahora" se anima suavemente cada minuto (transición de posición, no salto brusco); toggle de leyenda anima opacidad de los eventos filtrados (fade, no desaparición abrupta).

### Estados
Día sin eventos: agenda muestra estado vacío minimalista ("Sin actividades — día libre") con icono de café/descanso.

---

## 4. Nutrición

### Objetivo UX
Registro simple de comidas, hidratación y macronutrientes, con foco en tendencia semanal más que en conteo obsesivo (tono "rendimiento", no "dieta").

### Layout — Mobile
```
┌─────────────────────────────┐
│  Nutrición                    │
│  L M X J (V) S D              │ ← tira de 7 días
├─────────────────────────────┤
│     ⭕ 1,850 / 2,400 kcal      │ ← anillo calórico + macros
│   Prot · Carbs · Grasas       │   (3 arcos concéntricos)
├─────────────────────────────┤
│  HIDRATACIÓN     1.2 / 2.5 L  │
│  💧💧💧💧🔲🔲🔲            [+250ml]│
├─────────────────────────────┤
│  COMIDAS DE HOY               │
│  ┌ Desayuno · 420 kcal ────┐ │
│  ┌ Almuerzo · 680 kcal ────┐ │
│  ┌ + Añadir alimento ──────┐ │ ← card dashed, tappable
├─────────────────────────────┤
│  RESUMEN SEMANAL               │
│  [ bar chart kcal por día ]   │
├─────────────────────────────┤
│  💡 Consejo del día (carousel)│
└─────────────────────────────┘
```

### Layout — Desktop
Dos columnas: izquierda (anillo calórico + hidratación, sticky), derecha (lista de comidas + gráfico semanal + carrusel de tips).

### Posición y jerarquía visual
El anillo calórico es el ancla (igual peso visual que los anillos del Dashboard, mismo lenguaje de diseño); hidratación justo debajo por ser el segundo hábito más frecuente de registrar; lista de comidas ocupa el resto del scroll.

### Cards
Meal card: icono de tipo de comida a la izquierda (café=desayuno, etc.), nombre + kcal total, 3 mini barras horizontales de macros (P/C/G) coloreadas, chevron para expandir y ver items individuales con opción de eliminar (swipe o icono papelera). Card "+ Añadir alimento": borde punteado, icono `+` centrado, fondo transparente — visualmente distinta a las demás para invitar a la acción.

### Botones
`+250ml` quick-add (chip button, tap repetible), botón primario dentro del formulario de registrar comida (bottom sheet: buscar alimento / cantidad / comida del día).

### Iconos
`Coffee`/`Sun`/`Moon`/`Cookie` (tipos de comida), `Droplet` (hidratación, se rellena visualmente al aumentar el progreso), `Plus`.

### Gráficos
Anillo calórico + 3 arcos de macros concéntricos (SVG custom, mismo motor que los anillos del Dashboard). `BarChart` de Chart.js para kcal por día de la semana, con línea de referencia horizontal marcando el objetivo diario.

### Tipografía
Número central del anillo `Display 32/800`; "/ 2,400 kcal" en peso más ligero (400) y tamaño menor para jerarquizar consumido vs objetivo; nombres de comida `H3 15/600`.

### Espaciados
Gotas de hidratación con gap `6px`; cards de comida `padding 14px 16px`, gap `10px`.

### Tema oscuro
Gotas vacías = contorno `#2A3038`; gotas llenas = degradado ámbar-agua; el anillo calórico usa el gradiente ámbar sobre track `#232933`.

### Tema claro
Barras de macros con colores planos saturados sobre fondo blanco para máximo contraste.

### Responsive
Mobile: gotas de hidratación en fila única con scroll si el objetivo es alto. Desktop: gotas en grid, más espacio para mostrar todas sin scroll.

### Animaciones y microinteracciones
Tap en gota de agua → se rellena con una animación de "onda" ascendente + micro-rebote del icono; anillo calórico se recalcula y re-anima cada vez que se añade un alimento (no salta, interpola desde el valor anterior); tarjeta de comida al expandir usa `layout` animation de Framer Motion (altura automática suave); carousel de consejos con snap-scroll y indicador de puntos (dots) debajo.

### Estados
Sin comidas registradas hoy: sección de comidas muestra 3 slots vacíos (Desayuno/Almuerzo/Cena) invitando a registrar, en vez de un estado vacío genérico.

---

## 5. Recuperación

### Objetivo UX
Comunicar en un vistazo si el cuerpo está listo para exigir o si toca bajar intensidad — inspirado en Garmin Body Battery / Whoop Recovery.

### Layout — Mobile
```
┌─────────────────────────────┐
│  Recuperación                 │
├─────────────────────────────┤
│      ◜◝ 78 ◟◞                │ ← gauge grande semicircular
│      Recuperación óptima      │
├─────────────────────────────┤
│ 🌙Sueño  ❤️FC reposo  📈HRV   │ ← 3 cards pequeñas con sparkline
├─────────────────────────────┤
│  ¿CÓMO TE SIENTES HOY?        │
│  😣 😕 😐 🙂 😄                │ ← selector emoji
│  Dolor muscular:  [chips]     │
├─────────────────────────────┤
│  ⚠️ Lesión activa: Isquiotib. │ ← solo si aplica (card roja)
├─────────────────────────────┤
│  TENDENCIA (14 días)          │
│  [ line chart con bandas ]    │
├─────────────────────────────┤
│  💡 "Hoy prioriza recup. activa"│
└─────────────────────────────┘
```

### Layout — Desktop
3 columnas: gauge + check-in (izquierda), sub-métricas sueño/FC/HRV en columna central apiladas, tendencia + recomendación + estado de lesiones a la derecha.

### Posición y jerarquía visual
El gauge es el elemento dominante (igual jerarquía visual que el anillo del Dashboard). El check-in diario es la segunda prioridad porque es la única interacción activa de la pantalla (todo lo demás es lectura). La card de lesión, si existe, se posiciona con alta prominencia (color de alerta) independientemente del orden de scroll natural — nunca se "esconde" abajo.

### Cards
Sub-métricas: card compacta con icono, valor grande, sparkline de 7 días de fondo (muy sutil, detrás del número), flecha de tendencia (↑/↓ verde o rojo según si sube o baja es bueno para esa métrica). Card de check-in: fondo neutro, selector de emojis grandes (44px, tap = scale+color), chips de dolor muscular por zona (Piernas/Core/Superior) como toggle multi-selección.

### Botones
Emojis actúan como botones de selección única (radio-like). Chips de dolor muscular multi-selección (toggle). Botón `Ver historial de lesiones` (texto/link) dentro de la card de alerta.

### Iconos
`Moon` (sueño), `Heart` (FC reposo), `Activity` (HRV/estrés), `AlertTriangle` (lesión), `Sparkles` o `Lightbulb` (recomendación).

### Gráficos
Gauge semicircular custom (igual familia visual que anillos de Dashboard/Nutrición, pero en arco 180° con gradiente rojo→ámbar→verde). `LineChart` de tendencia con `bandas de fondo` (zonas de color por rango de puntuación, usando `Chart.js` con plugin de anotación de zonas). Sparklines diminutos en cada sub-card.

### Tipografía
Número del gauge `Display 40/800`; estado textual debajo `H3 16/600` con color coincidente al rango (rojo/ámbar/verde); labels de sub-cards `caption uppercase`.

### Espaciados
Selector de emojis con gap `12px` entre cada uno para evitar toques accidentales; chips de dolor con gap `8px`, wrap en múltiples líneas si es necesario.

### Tema oscuro
Gradiente del gauge con glow correspondiente al color resultante (rojo=glow coral, verde=glow menta); bandas del line chart en opacidades bajas (8–12%) para no competir con la línea principal.

### Tema claro
Bandas del line chart en tonos pastel muy suaves; gauge con sombra difusa de color acorde al estado.

### Responsive
Mobile: sub-métricas en fila horizontal scrollable de 3 cards. Desktop: columna vertical apilada, más espacio para sparklines más largos (14 días visibles en vez de 7).

### Animaciones y microinteracciones
El gauge dibuja su arco y **interpola el color** desde gris neutro hasta el color final del rango mientras se anima (no es un color estático desde el frame 1); selección de emoji → bounce + los demás emojis reducen opacidad al 50% para confirmar la elección; chip de dolor muscular al activarse pulsa una vez (feedback de confirmación); si hay lesión activa, la card de alerta tiene una entrada distinta (fade+shake sutil de 2px, una sola vez, para llamar la atención sin ser molesto en visitas repetidas).

### Estados
Sin check-in hecho hoy: la sección de check-in tiene un borde punteado sutil y un badge "Pendiente" hasta que se completa, luego se colapsa a un resumen de una línea ("Te sientes bien 🙂 · Sin dolor").

---

## 6. Biblioteca

### Objetivo UX
Repositorio de ejercicios/drills consultable y filtrable, reutilizable al planificar sesiones — equivalente al catálogo de ejercicios de Nike Training Club.

### Layout — Mobile
```
┌─────────────────────────────┐
│  🔍 Buscar ejercicios...      │
│  [Físico][Técnico][Táctico]… │ ← chips de filtro (scroll horiz.)
├─────────────────────────────┤
│  COLECCIONES DESTACADAS       │
│  [ card grande ][ card grande]│ ← scroll horizontal
├─────────────────────────────┤
│  TODOS LOS EJERCICIOS         │
│  ┌────────┐  ┌────────┐      │ ← grid 2 columnas
│  │ thumb  │  │ thumb  │      │
│  │ ▶ 4:20 │  │        │      │
│  │ Título │  │ Título │      │
│  │ 🟠 Interm.│ │ 🔵 Avanz. │  │
│  └────────┘  └────────┘      │
└─────────────────────────────┘
```
Detalle: modal/página con imagen o video hero (16:9), título, tags de músculos/categoría, lista numerada de instrucciones, botón `Añadir a sesión`, carrusel "Ejercicios relacionados" al final.

### Layout — Desktop
Filtros persistentes en sidebar izquierda (checkboxes agrupados por Categoría/Nivel/Equipamiento), grid de 4–5 columnas a la derecha, cards más grandes con hover que revela preview.

### Posición y jerarquía visual
El buscador encabeza todo (mismo patrón que apps de referencia: búsqueda antes que navegación por categoría). Colecciones destacadas anteceden al catálogo completo porque son "curadas" (mayor intención editorial → mayor prioridad visual, cards más grandes).

### Cards
Exercise card: thumbnail cuadrado/16:9 con overlay de badge `▶ play` si tiene video y duración en esquina inferior derecha del thumbnail; debajo, título + fila de tags pequeños (categoría color-coded + nivel). Collection card: más ancha (ratio 3:2), imagen de fondo con overlay de gradiente oscuro + título en blanco superpuesto (estilo "programa" de NTC).

### Botones
Chips de filtro multi-selección (toggle, fondo transparente→relleno al activar); botón primario `Añadir a sesión` en el detalle; icon button de favorito (corazón/estrella) en esquina de cada card.

### Iconos
`Search`, `Play` (overlay de video), `Heart` (favorito), `Filter` (abre bottom sheet de filtros avanzados en mobile), iconos de categoría heredados del sistema de dominio.

### Gráficos
No aplica gráficos de datos en esta pantalla (es un catálogo de contenido).

### Tipografía
Buscador placeholder `body 14/400` gris; título de card `H3 15/600` (máx 2 líneas, truncado con ellipsis); tags `caption 11/600`.

### Espaciados
Grid con gap `12px` mobile / `20px` desktop; chips de filtro gap `8px`.

### Tema oscuro
Overlays de gradiente sobre imágenes ligeramente más opacos (mejor legibilidad de texto blanco); thumbnails con borde `1px` sutil para separarse del fondo oscuro cuando la imagen es oscura también.

### Tema claro
Sombra sutil bajo cada card del grid para separación; overlay de gradiente en collection cards más ligero.

### Responsive
Mobile: grid 2 columnas, colecciones en carrusel. Tablet: grid 3 columnas. Desktop: grid 4–5 columnas + sidebar de filtros fijo.

### Animaciones y microinteracciones
Al cambiar filtro, el grid reordena con animación `layout` (Framer Motion `AnimatePresence` + `layout`) — los items que desaparecen hacen fade-out+scale-down, los que aparecen hacen fade-in+scale-up, sin "saltos" de layout bruscos; hover en desktop = card eleva (`translateY(-4px)` + sombra) y el thumbnail de video hace autoplay mudo del preview; tap en favorito = icono de corazón con animación de "pop" (scale 1→1.3→1) y cambio de color instantáneo.

### Estados
Búsqueda sin resultados: ilustración + "No encontramos ejercicios para «sprint lateral»" + sugerencia de limpiar filtros.

---

## 7. Perfil

### Objetivo UX
Identidad del deportista: quién es, sus números de carrera, sus logros — la pantalla más "personal" y con más carga emocional/motivacional de la app.

### Layout — Mobile
```
┌─────────────────────────────┐
│  ░░░ banner con gradiente ░░ │  ✏️
│         (Avatar) grande       │  ← overlapping el banner
│         Leo García             │
│        Delantero · Sub-17      │
├─────────────────────────────┤
│  42     18      9      12 días│ ← fila de stats compactos
│ Partidos Goles Asist. Racha   │
├─────────────────────────────┤
│ [Resumen|Estadísticas|Logros|Actividad] ← tabs
├─────────────────────────────┤
│  (contenido según tab)         │
└─────────────────────────────┘
```
Tab **Logros**: grid de medallas/trofeos (locked = escala de grises + candado, unlocked = a color con leve brillo). Tab **Actividad**: timeline vertical con línea conectora, cada evento con icono+timestamp+descripción.

### Layout — Desktop
Banner ancho completo arriba; debajo, 2 columnas: izquierda sticky (avatar, nombre, stats, bio), derecha (tabs + contenido).

### Posición y jerarquía visual
Avatar + nombre es el punto focal absoluto (mayor tamaño de imagen de toda la app). La fila de stats numérica es la segunda prioridad — números grandes, sin decoración, como una "tarjeta de estadísticas de cromo de cambio" (trading card).

### Cards
Stat block: número `Display` + label caption, sin bordes ni fondo (flotan directamente sobre el layout, separados por delgados divisores verticales). Achievement card: cuadrada, icono/medalla centrado, nombre debajo, barra de progreso fina si está en curso (ej. "8/10 entrenamientos"). Activity timeline item: icono en círculo sobre la línea vertical + card de contenido a la derecha con timestamp relativo ("hace 2h").

### Botones
Icon button `✏️ Editar perfil` (esquina superior del banner); en tab Logros, tap en medalla abre modal con criterio + progreso; menú de overflow (⋮) con acceso a Configuración/Cerrar sesión.

### Iconos
`Edit`, `Trophy`/`Medal`, `TrendingUp`, iconos por tipo de evento en la timeline (heredados de Entrenamientos/Partidos/Recuperación).

### Gráficos
Mini `RadarChart` en tab Resumen mostrando perfil físico actual (Velocidad/Resistencia/Fuerza/Agilidad/Técnica) — versión compacta de la de Estadísticas, solo lectura, sin filtros.

### Tipografía
Nombre `H1 24/700` en color blanco sobre el banner (con sombra de texto sutil para legibilidad); posición/equipo `body 14/500` con opacidad reducida; stat numbers `Display 26/800`; stat labels `caption uppercase`.

### Espaciados
Avatar `96px` de diámetro, solapando el banner `-48px` (mitad dentro/mitad fuera); padding lateral de contenido `16px`; grid de logros gap `12px`.

### Tema oscuro
Banner usa gradiente de colores de equipo con opacidad reducida sobre negro para no "quemar" contraste; medallas desbloqueadas tienen glow leve del color de su categoría.

### Tema claro
Banner con gradiente a mayor saturación (compensa que el resto de la UI es más neutra/clara); sombra de texto en nombre reforzada para legibilidad sobre banner claro.

### Responsive
Mobile: banner `140px` alto. Desktop: banner `220px` alto, layout de 2 columnas descrito arriba en vez de todo apilado.

### Animaciones y microinteracciones
Avatar hace un scale-in sutil (`0.9→1`) al montar la pantalla; al desbloquear un logro nuevo (evento en tiempo real, ej. justo tras completar un entrenamiento), la medalla correspondiente reproduce una animación de "shine" (barrido de brillo diagonal) una única vez la primera vez que se visualiza desbloqueada; cambio de tab hace cross-fade + slight slide del contenido (no recarga toda la pantalla); timeline items entran con stagger fade-up al hacer scroll (scroll-triggered reveal, no todos de golpe).

### Estados
Perfil nuevo sin actividad: tab Actividad muestra estado vacío motivacional ("Tu historial empieza hoy 💪"); tab Logros muestra todos los trofeos en estado locked con un contador "0/24 desbloqueados".

---

## 8. Configuración

### Objetivo UX
Control total sobre cuenta, apariencia, unidades, notificaciones y datos — debe sentirse tan pulido y confiable como los ajustes de iOS.

### Layout — Mobile
```
┌─────────────────────────────┐
│  Configuración                 │
├─────────────────────────────┤
│  (Avatar) Leo García      >   │ ← card de cuenta, tap→editar
├─────────────────────────────┤
│  APARIENCIA                    │
│  ┌───┐ ┌───┐ ┌───┐            │ ← 3 preview cards
│  │Claro│Oscuro│Sistema│ (✓)    │
├─────────────────────────────┤
│  PREFERENCIAS                  │
│  📏 Unidades          Métrico >│
│  🔔 Notificaciones         >  │
├─────────────────────────────┤
│  DATOS                         │
│  ⬇️ Exportar datos           > │
│  🗑️ Borrar todos los datos  > │ ← texto en rojo
├─────────────────────────────┤
│  ACERCA DE                     │
│  Versión 1.0.0                 │
└─────────────────────────────┘
```

### Layout — Desktop
Estilo macOS System Settings: lista de categorías en columna izquierda (240px), panel de detalle a la derecha con el contenido de la categoría seleccionada (en vez de navegación por push como en mobile).

### Posición y jerarquía visual
La card de cuenta (avatar+nombre) siempre arriba del todo — es la identidad antes que las preferencias. Las acciones destructivas (borrar datos) siempre al final y visualmente distintas (texto rojo, sin icono de fondo de color, para que no se confundan con una acción neutra).

### Cards
Sección agrupada estilo iOS: contenedor `rounded-2xl` con filas separadas por divisor `1px` interno (no cards individuales sueltas, sino un grupo cohesivo). Cada fila: icono en cuadrado `rounded-lg` de color de fondo suave a la izquierda, label, valor actual/chevron/switch a la derecha.

### Botones
Switches tipo iOS (track `rounded-full`, thumb circular, animación de slide + fill de color al activar). Preview cards de tema: seleccionable como radio (borde de acento + check al seleccionado). Fila completa es tappable (target de toque generoso, no solo el control).

### Iconos
`User`, `Sun`/`Moon`/`Monitor` (temas), `Ruler` (unidades), `Bell`, `Download`, `Trash2` (rojo), `Info`, `ChevronRight`.

### Gráficos
No aplica.

### Tipografía
Encabezado de sección (APARIENCIA, DATOS...) `caption 12/600 uppercase` gris, separado del grupo por `8px`; labels de fila `body 15/500`; valores secundarios `body 14/400` gris a la derecha.

### Espaciados
Grupo con padding interno `0` (las filas manejan su propio `padding: 14px 16px`); gap entre grupos `24px`.

### Tema oscuro
Preview cards de tema muestran un mockup en miniatura real del tema (no solo un color plano) para que el usuario vea exactamente qué va a obtener. Fondos de icono con opacidad ajustada para no verse "lavados" sobre superficie oscura.

### Tema claro
Divisores internos de grupo en gris muy claro `#EEF0F2` para no competir con el contenido.

### Responsive
Mobile: navegación por push (tap en fila → nueva pantalla con back). Desktop: todo visible simultáneamente sin navegación, cambia solo el panel derecho.

### Animaciones y microinteracciones
Switch: thumb se desliza con spring snappy + el track cambia de color con un cross-fade de 150ms; selección de tema aplica un **cross-fade de toda la app** (breve, 300–400ms) al confirmar, para que el cambio de paleta se sienta intencional y no un parpadeo brusco; acción destructiva (`Borrar datos`) siempre abre un modal de confirmación con el botón de confirmar deshabilitado hasta que el usuario escribe "BORRAR" o mantiene presionado 1s (patrón de fricción intencional para prevenir errores).

### Estados
No aplica loading significativo (datos locales); tras exportar, toast de confirmación con icono de check.

---

## 9. Historial

### Objetivo UX
Archivo cronológico y buscable de todo lo que ha ocurrido — la "memoria" de la app, análoga al feed de actividades de Strava/Garmin.

### Layout — Mobile
```
┌─────────────────────────────┐
│  🔍 Buscar en el historial    │
│  📅 Este mes: 12 sesiones · 8h│ ← resumen compacto
├─────────────────────────────┤
│  JULIO 2026                   │ ← header de grupo (sticky)
│  ┌ 🟠 Entren. físico · 22 jul│
│  ┌ ⚽ vs. Rayo FC · 20 jul     │
│  ┌ 📈 Test de velocidad · 18  │
├─────────────────────────────┤
│  JUNIO 2026                   │
│  ┌ ...                        │
├─────────────────────────────┤
│      [ Cargar más ]           │
└─────────────────────────────┘
```

### Layout — Desktop
Filtros en sidebar izquierda (tipo de evento, rango de fechas con date-picker); lista densa a la derecha, opcionalmente en formato tabla (columnas: Fecha | Tipo | Título | Métrica clave) con opción de orden por columna.

### Posición y jerarquía visual
El buscador y el resumen compacto encabezan (permiten saltar directo sin scrollear); los headers de grupo (mes) son sticky al hacer scroll — se "pegan" arriba y se comprimen, replicando el patrón de listas grandes de iOS (Contactos/Fotos/Mensajes).

### Cards
List item denso: icono de tipo a la izquierda (círculo de color de fondo suave), título + fecha/duración, badge de métrica clave a la derecha (ej. "92% asistencia", "8.4 km", "+2 goles"), chevron final. Sin sombra ni borde individual — la separación es por divisor `1px` entre filas dentro de cada grupo mensual (lista densa, no cards flotantes, para permitir escanear muchos ítems rápido).

### Botones
`Cargar más` (texto, centrado, o infinite scroll automático); icon button de filtro abre bottom sheet con checkboxes de tipo + date range picker.

### Iconos
Iconos de tipo heredados de todo el sistema (entrenamiento/partido/test/logro/check-in de recuperación), `Search`, `SlidersHorizontal` (filtros).

### Gráficos
Mini `BarChart` opcional en el resumen superior: volumen semanal de actividad del mes en curso (7–5 barras), muy compacto, solo decorativo/informativo.

### Tipografía
Header de grupo (mes) `caption 12/700 uppercase`, fondo con blur al volverse sticky; título de item `body 14/500`; badge de métrica `caption 12/700 tabular-nums` en color de acento del tipo.

### Espaciados
Filas con `padding 12px 16px`; sin gap entre filas del mismo grupo (usan divisor), `20px` de gap entre grupos mensuales.

### Tema oscuro
Header sticky con `backdrop-filter: blur` + fondo semitransparente `#0B0E11cc` para que el contenido se perciba deslizando debajo.

### Tema claro
Mismo comportamiento sticky con blanco semitransparente; divisores en gris muy sutil.

### Responsive
Mobile: lista simple agrupada. Desktop: opción de vista tabla (toggle lista/tabla arriba a la derecha) para usuarios que prefieren escanear más datos por fila.

### Animaciones y microinteracciones
Header de mes al volverse sticky reduce ligeramente su tamaño de fuente (`14→12px`) con transición suave (efecto "large title collapse" de iOS); aparición de nuevos grupos al hacer scroll/cargar más = fade-in stagger; swipe en fila (mobile) puede revelar acción rápida "Ver detalle" (aunque el tap normal ya navega, el swipe es un atajo opcional, no obligatorio).

### Estados
Sin resultados de búsqueda: mismo patrón que Biblioteca (ilustración + mensaje + sugerencia de limpiar filtros). Historial vacío (usuario nuevo): mensaje motivacional + CTA a "Empezar tu primer entrenamiento".

---

## 10. Estadísticas

### Objetivo UX
Analítica profunda de rendimiento — la pantalla más "densa en datos" de la app, con el estándar visual de un dashboard de BI deportivo (Garmin Connect Stats / NTC Progress).

### Layout — Mobile
```
┌─────────────────────────────┐
│  Estadísticas       [Jugador▾]│ ← selector (solo rol coach)
│  [Semana|Mes|Temporada|Custom]│
├─────────────────────────────┤
│ Vel.máx  Distancia  Carga  VO2│ ← 4 KPI cards (scroll horiz.)
│ 32km/h ↑2%          ...       │
├─────────────────────────────┤
│  [Velocidad|Resist.|Fuerza|Agil]│ ← tabs de métrica
│  ┌───────────────────────┐   │
│  │   line/area chart      │   │
│  └───────────────────────┘   │
├─────────────────────────────┤
│  PERFIL FÍSICO                 │
│  ┌──── radar chart ──────┐   │
├─────────────────────────────┤
│  DISTRIBUCIÓN DE ENTRENOS      │
│  [ bar chart apilado ]        │
└─────────────────────────────┘
```

### Layout — Desktop
Grid tipo dashboard BI: fila superior de 4 KPI cards a ancho completo, debajo 2 columnas (chart principal grande a la izquierda 65%, radar + distribución apilados a la derecha 35%), con panel de comparación de jugadores desplegable (solo coach) como sección final a ancho completo.

### Posición y jerarquía visual
KPIs primero (números que se leen en 1 segundo), luego el chart principal interactivo (la pieza de mayor superficie y detalle), radar y distribución como apoyo secundario. El selector de rango de tiempo controla *todo* lo que está debajo — se posiciona fijo/sticky para que nunca se pierda de vista al hacer scroll en una pantalla tan larga.

### Cards
KPI card: icono pequeño arriba, número `Display` grande, delta con flecha (verde ↑ / rojo ↓, según si esa métrica mejorar es positivo) y sparkline de fondo muy sutil (opacidad 15%) ocupando toda la card como textura, no como dato explícito. Chart card: header con tabs de selección de métrica dentro de la misma card (no fuera), leyenda de series abajo del gráfico, botón de exportar (icono) en la esquina.

### Botones
Tabs de métrica (segmented, indicador deslizante); selector de rango temporal (segmented); dropdown `Jugador` (solo visible con rol coach/analyst); icon button `Download`/`Share` para exportar (preparado para PDF/CSV a futuro, aunque hoy pueda estar deshabilitado).

### Iconos
`Zap` (velocidad), `MapPin`/`Route` (distancia), `BatteryCharging` (carga), `Wind` (VO2max), `Download`, `Users` (comparación).

### Gráficos
- **Line/Area chart** principal (Chart.js): eje X temporal, eje Y valor de la métrica seleccionada, área con gradiente sutil bajo la línea, tooltip custom on hover/tap mostrando fecha+valor+contexto (entrenamiento/partido/test).
- **Radar chart**: pentágono/hexágono de 5 ejes (Velocidad/Resistencia/Fuerza/Agilidad/Técnica), overlay de dos series (actual vs periodo anterior, o jugador vs promedio de equipo) con relleno semitransparente distinguible por color.
- **Bar chart** de distribución: barras agrupadas o apiladas por semana, coloreadas por tipo de sesión (mismos colores semánticos del sistema).
- **Panel de comparación** (coach): mismos radar/bar pero con N series (una por jugador seleccionado), leyenda con chips de color+nombre, hasta 4 jugadores simultáneos antes de saturar visualmente.

### Tipografía
KPI number `Display 30/800 tabular-nums`; delta `caption 12/700` en verde/rojo; título de chart card `H3 16/600`; labels de radar `caption 11/600` en los vértices.

### Espaciados
KPI cards `padding 16px`, gap `12px` en scroll horizontal mobile / grid `16px` desktop; chart card `padding 20px` con el canvas ocupando el resto del espacio disponible.

### Tema oscuro
Gradiente bajo la línea del area chart más sutil (opacidad reducida) para no "iluminar" en exceso; grid lines del chart en gris muy tenue `#2A3038`; radar con relleno semitransparente ajustado para que ambas series sigan siendo distinguibles sobre fondo oscuro.

### Tema claro
Grid lines en `#EEF0F2`; sombra difusa bajo chart cards para separarlas del fondo `#F7F8FA`.

### Responsive
Mobile: KPIs en scroll horizontal, un chart a la vez, radar y distribución apilados debajo. Desktop: layout de dashboard multi-columna descrito arriba, con posibilidad de ver 2–3 charts simultáneamente sin scroll.

### Animaciones y microinteracciones
Chart.js configurado con animación de entrada `easeOutQuart`, 700ms, dibujando la línea de izquierda a derecha; al cambiar de tab de métrica, el dataset hace un **morph animado** entre curvas (no un reemplazo brusco — Chart.js anima la transición de puntos existentes a los nuevos valores); KPI deltas con flecha tienen un pulso sutil una vez al montar para llamar la atención sobre la tendencia; tooltip sigue el cursor/dedo con un pequeño delay/spring en vez de saltar instantáneamente; en el radar de comparación, activar/desactivar un jugador desde la leyenda anima la entrada/salida de su serie (fade + scale del polígono, no aparición instantánea).

### Estados
Sin datos suficientes para un rango (ej. jugador nuevo, "Temporada" recién empezada): el chart muestra un estado vacío dentro de la propia card ("Necesitas al menos 3 registros para ver tendencias") en vez de un gráfico vacío o roto.

---

## 11. Resumen de coherencia visual entre pantallas

Para que la app se sienta de una sola pieza (no 10 pantallas distintas cosidas):

- El **lenguaje de "anillo/gauge animado"** se repite en Dashboard, Nutrición y Recuperación — es la firma visual de la app, siempre con el mismo motor de animación y misma familia de grosor/cap.
- Los **colores semánticos por dominio** (§0.2) son universales: el naranja siempre es "físico", el ámbar siempre es "nutrición", etc., sin excepciones entre pantallas.
- El **patrón de card con barra lateral de color** (Entrenamientos, Calendario, Historial) es consistente en toda la app para "tipo de evento".
- Los **segmented controls con indicador deslizante** (Entrenamientos, Calendario, Estadísticas, Perfil) comparten exactamente la misma implementación visual y de motion.
- El **tratamiento de estados vacíos** (ilustración ligera + mensaje + CTA opcional) sigue la misma fórmula en todas las pantallas listadas.
- La **jerarquía tipográfica** (§0.1) no tiene excepciones por pantalla — un H2 es un H2 en Dashboard y en Configuración.

Este documento, junto con `ARCHITECTURE.md`, es la referencia obligatoria antes de construir cualquier componente visual: cada pantalla debe poder trazarse 1:1 contra esta especificación.
