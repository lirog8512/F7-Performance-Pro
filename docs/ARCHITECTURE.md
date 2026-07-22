# F7 Performance Pro — Arquitectura de Software

**Versión:** 1.0 (documento fundacional, previo a implementación)
**Autor:** Software Architecture
**Stack:** React + Vite + TailwindCSS + Framer Motion + React Router + Zustand + Chart.js + LocalStorage (→ Supabase/SQLite)

---

## 1. Visión y principios arquitectónicos

F7 Performance Pro es una PWA de rendimiento deportivo (fútbol 7) para cuerpos técnicos: gestión de equipos, jugadores, entrenamientos, partidos y métricas de rendimiento físico/técnico, con analítica visual (estilo Nike Training Club / plataformas de alto rendimiento).

Principios que gobiernan cada decisión de esta arquitectura:

1. **Feature-first, no type-first.** El código se organiza por *dominio* (jugadores, entrenamientos, partidos...), no por tipo técnico (todos los componentes juntos, todos los hooks juntos). Esto es lo que permite que la app crezca de 5 a 50 pantallas sin que las carpetas se vuelvan inmanejables.
2. **Separación estricta UI ↔ Estado ↔ Datos.** Los componentes nunca acceden a `localStorage` ni a un futuro cliente de Supabase directamente. Siempre hablan con un *store*, y el store siempre habla con un *service*. Esto es lo que hace que migrar de LocalStorage a Supabase/SQLite sea un cambio de una sola capa, no una reescritura.
3. **Persistencia intercambiable (Adapter Pattern).** Toda la capa de datos se escribe contra una interfaz abstracta (`StorageAdapter`). Hoy la implementa LocalStorage; mañana Supabase o SQLite, sin tocar stores, hooks ni componentes.
4. **Mobile-first, pero no mobile-only.** Layouts responsive con breakpoints Tailwind, navegación adaptativa (bottom nav en móvil, sidebar en escritorio), gestos y animaciones (Framer Motion) pensadas para tacto y ratón por igual.
5. **Diseño orientado a datos.** Cada entidad del dominio tiene un modelo explícito (`src/models`), documentado y versionado, antes de que exista una sola pantalla que lo consuma.
6. **Progressive enhancement técnico.** Empieza simple (LocalStorage, sin backend), pero cada capa se diseña ya pensando en su reemplazo (auth, sync, roles, multi-club).
7. **Convención sobre configuración.** Nombres, estructura y patrones predecibles para que cualquier desarrollador (o IA) sepa dónde va cada cosa sin tener que preguntar.

---

## 2. Estructura completa de carpetas

```
f7-performance-pro/
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   ├── maskable-icon-512x512.png
│   │   └── apple-touch-icon.png
│   ├── splash/                        # splash screens iOS (varias resoluciones)
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── favicon.ico
│
├── src/
│   ├── main.jsx                       # entry point (ReactDOM.createRoot)
│   ├── App.jsx                        # composición de providers + router
│   │
│   ├── app/                           # bootstrap de la aplicación (no es "feature")
│   │   ├── providers/
│   │   │   ├── AppProviders.jsx       # compone todos los providers
│   │   │   ├── ThemeProvider.jsx
│   │   │   ├── ToastProvider.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── router/
│   │   │   ├── router.jsx             # createBrowserRouter con rutas
│   │   │   ├── routes.config.js       # definición declarativa de rutas (paths, meta)
│   │   │   ├── ProtectedRoute.jsx     # guard por autenticación
│   │   │   └── RoleRoute.jsx          # guard por rol (coach/admin/analyst)
│   │   └── layout/
│   │       ├── AppShell.jsx           # layout autenticado (sidebar + topbar + outlet)
│   │       ├── AuthLayout.jsx         # layout de login/onboarding
│   │       ├── Sidebar.jsx            # navegación desktop
│   │       ├── BottomNav.jsx          # navegación móvil
│   │       ├── Topbar.jsx
│   │       └── PageContainer.jsx      # wrapper con paddings/transiciones estándar
│   │
│   ├── features/                      # 🧠 núcleo del dominio, un folder por feature
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/                 # LoginPage, OnboardingPage
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── models/
│   │   │   └── index.js               # barrel export (API pública del feature)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/            # KpiCard, PerformanceOverviewChart, UpcomingEvents
│   │   │   ├── hooks/                 # useDashboardSummary
│   │   │   ├── pages/                 # DashboardPage
│   │   │   └── index.js
│   │   │
│   │   ├── players/
│   │   │   ├── components/            # PlayerCard, PlayerForm, PlayerAvatar, PlayerList
│   │   │   ├── hooks/                 # usePlayers, usePlayer, usePlayerForm
│   │   │   ├── pages/                 # PlayersListPage, PlayerDetailPage, PlayerFormPage
│   │   │   ├── services/              # playerService.js
│   │   │   ├── store/                 # playersStore.js
│   │   │   ├── models/                # player.model.js
│   │   │   ├── utils/                 # calculateAge, formatPosition
│   │   │   └── index.js
│   │   │
│   │   ├── teams/
│   │   │   ├── components/            # TeamCard, TeamForm, RosterTable
│   │   │   ├── hooks/                 # useTeams, useTeam, useRoster
│   │   │   ├── pages/                 # TeamsListPage, TeamDetailPage
│   │   │   ├── services/              # teamService.js
│   │   │   ├── store/                 # teamsStore.js
│   │   │   ├── models/                # team.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── trainings/
│   │   │   ├── components/            # SessionCard, ExerciseBuilder, AttendanceTracker
│   │   │   ├── hooks/                 # useTrainingSessions, useAttendance
│   │   │   ├── pages/                 # TrainingsCalendarPage, SessionDetailPage
│   │   │   ├── services/              # trainingService.js
│   │   │   ├── store/                 # trainingsStore.js
│   │   │   ├── models/                # trainingSession.model.js, exercise.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── matches/
│   │   │   ├── components/            # MatchCard, LineupBoard, MatchTimeline, ScoreBoard
│   │   │   ├── hooks/                 # useMatches, useMatchStats
│   │   │   ├── pages/                 # MatchesListPage, MatchDetailPage, LiveMatchPage
│   │   │   ├── services/              # matchService.js
│   │   │   ├── store/                 # matchesStore.js
│   │   │   ├── models/                # match.model.js, matchEvent.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── performance/
│   │   │   ├── components/            # MetricChart, RadarProfile, ProgressTrend, TestForm
│   │   │   ├── hooks/                 # usePerformanceMetrics, usePlayerComparison
│   │   │   ├── pages/                 # PerformanceHubPage, PlayerPerformancePage
│   │   │   ├── services/              # performanceService.js
│   │   │   ├── store/                 # performanceStore.js
│   │   │   ├── models/                # performanceMetric.model.js, physicalTest.model.js
│   │   │   ├── utils/                 # métricas derivadas (VO2max estimates, etc.)
│   │   │   └── index.js
│   │   │
│   │   ├── injuries/
│   │   │   ├── components/            # InjuryCard, InjuryTimeline
│   │   │   ├── hooks/                 # useInjuries
│   │   │   ├── pages/                 # InjuriesListPage
│   │   │   ├── services/              # injuryService.js
│   │   │   ├── store/                 # injuriesStore.js
│   │   │   ├── models/                # injury.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── calendar/
│   │   │   ├── components/            # CalendarGrid, EventCard, MiniCalendar
│   │   │   ├── hooks/                 # useCalendarEvents
│   │   │   ├── pages/                 # CalendarPage
│   │   │   ├── services/              # calendarService.js (agrega trainings + matches)
│   │   │   ├── store/                 # calendarStore.js
│   │   │   ├── models/                # calendarEvent.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── reports/
│   │   │   ├── components/            # ReportBuilder, ExportPanel
│   │   │   ├── hooks/                 # useReportData
│   │   │   ├── pages/                 # ReportsPage
│   │   │   ├── services/              # reportService.js (agrega datos de otros features)
│   │   │   └── index.js
│   │   │
│   │   └── settings/
│   │       ├── components/            # ThemeSwitcher, ProfileForm, DataExportImport
│   │       ├── hooks/                 # useSettings
│   │       ├── pages/                 # SettingsPage
│   │       ├── store/                 # settingsStore.js
│   │       └── index.js
│   │
│   ├── shared/                        # 🧰 todo lo transversal, reutilizable entre features
│   │   ├── components/
│   │   │   ├── ui/                    # Design System / átomos
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Drawer.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── index.js           # barrel: import { Button, Card } from '@/shared/components/ui'
│   │   │   ├── charts/                # wrappers de Chart.js reutilizables
│   │   │   │   ├── LineChart.jsx
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── RadarChart.jsx
│   │   │   │   ├── DoughnutChart.jsx
│   │   │   │   ├── chartTheme.js      # paleta/tipografía de charts sincronizada con Tailwind
│   │   │   │   └── index.js
│   │   │   ├── feedback/              # ToastContainer, ConfirmDialog, ErrorFallback
│   │   │   ├── forms/                 # FormField, FormError, DatePicker, FileUpload
│   │   │   └── motion/                # PageTransition, FadeIn, StaggerList (Framer wrappers)
│   │   │
│   │   ├── hooks/                     # hooks genéricos, no ligados a un dominio
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useMediaQuery.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useOnlineStatus.js
│   │   │   ├── usePwaInstallPrompt.js
│   │   │   ├── useDisclosure.js       # abrir/cerrar modal-drawer genérico
│   │   │   └── usePrevious.js
│   │   │
│   │   ├── services/
│   │   │   ├── storage/
│   │   │   │   ├── StorageAdapter.js       # interfaz abstracta (contrato)
│   │   │   │   ├── LocalStorageAdapter.js  # implementación actual
│   │   │   │   ├── SupabaseAdapter.js      # implementación futura (stub)
│   │   │   │   ├── SQLiteAdapter.js        # implementación futura (stub)
│   │   │   │   └── storageProvider.js      # factory: elige adapter según config/env
│   │   │   ├── api/
│   │   │   │   └── httpClient.js           # futuro cliente REST/Supabase, hoy sin uso
│   │   │   └── id/
│   │   │       └── idGenerator.js          # uuid v4 wrapper
│   │   │
│   │   ├── store/
│   │   │   ├── uiStore.js             # tema, sidebar abierto/cerrado, modales globales
│   │   │   └── rootPersistConfig.js   # config compartida de zustand/persist
│   │   │
│   │   ├── models/
│   │   │   ├── base.model.js          # BaseEntity: id, createdAt, updatedAt
│   │   │   └── enums.js               # Position, Role, Category, MetricType...
│   │   │
│   │   ├── utils/
│   │   │   ├── date.js                # formatDate, diffInDays, isToday...
│   │   │   ├── number.js              # round, average, percentageChange
│   │   │   ├── validation.js          # validadores de formularios (zod/yup o custom)
│   │   │   ├── array.js               # groupBy, sortBy
│   │   │   ├── string.js              # slugify, initials
│   │   │   └── constants.js           # límites, breakpoints, claves de storage
│   │   │
│   │   └── theme/
│   │       ├── tokens.js              # colores, spacing, radii, sombras (fuente de verdad)
│   │       ├── motion.js              # duraciones/easings estándar para Framer Motion
│   │       └── ThemeContext.js
│   │
│   ├── styles/
│   │   ├── index.css                  # @tailwind base/components/utilities + estilos globales
│   │   └── fonts.css
│   │
│   ├── assets/
│   │   ├── images/                    # ilustraciones, backgrounds, empty-states
│   │   ├── logos/                     # logo F7 Performance Pro (variantes)
│   │   └── icons/                     # SVGs propios (no confundir con /public/icons PWA)
│   │
│   ├── config/
│   │   ├── env.js                     # lectura tipada de import.meta.env
│   │   └── app.config.js              # nombre app, versión, feature flags
│   │
│   └── test/
│       ├── setupTests.js
│       └── mocks/                     # datos de ejemplo (seed data) para dev/test
│
├── .env.example
├── index.html
├── vite.config.js                     # incluye vite-plugin-pwa
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .prettierrc
└── package.json
```

**Por qué feature-first:** cuando el equipo crezca (más pantallas de rendimiento, scouting, nutrición, etc.), cada nueva funcionalidad es una carpeta nueva autocontenida en `features/`, sin tocar ni inflar las carpetas existentes. `shared/` solo crece con lo genuinamente reutilizable.

---

## 3. Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes React | `PascalCase.jsx` | `PlayerCard.jsx` |
| Hooks | `camelCase.js`, prefijo `use` | `usePlayers.js` |
| Services | `camelCase.js`, sufijo `Service` | `playerService.js` |
| Stores (Zustand) | `camelCase.js`, sufijo `Store` | `playersStore.js` |
| Modelos | `camelCase.model.js` | `player.model.js` |
| Utilidades | `camelCase.js`, verbo/sustantivo claro | `date.js`, `validation.js` |
| Carpetas | `kebab-case` o `camelCase` (nunca mixto) → usamos `camelCase` para alinear con imports JS | `trainings/`, `performance/` |
| Constantes globales | `UPPER_SNAKE_CASE` | `MAX_PLAYERS_PER_TEAM` |
| Contextos | `PascalCase` + sufijo `Context`/`Provider` | `ThemeProvider.jsx` |
| Tipos/Enums | `PascalCase` para el enum, `UPPER_SNAKE_CASE` para valores | `Position.GOALKEEPER` |
| Páginas | `PascalCase` + sufijo `Page` | `PlayerDetailPage.jsx` |
| Rutas (paths) | `kebab-case` | `/players/:playerId/performance` |
| Claves de LocalStorage | `f7.<dominio>.<entidad>` namespaced | `f7.players.v1` |
| CSS/Tailwind custom classes | `kebab-case` | `.card-elevated` |
| Eventos/handlers | `handle` + acción | `handlePlayerSubmit` |
| Booleanos | prefijo `is`/`has`/`can` | `isLoading`, `hasInjury` |

Reglas adicionales:
- Cada carpeta de `features/<feature>/` expone un **único punto de entrada** (`index.js`) que reexporta solo lo que otros features/app pueden usar. Nada importa directamente `features/players/store/playersStore.js` desde fuera de `players`; importa desde `features/players`.
- Alias de imports absolutos configurado en `vite.config.js` y `jsconfig.json`: `@/` → `src/`, y opcionalmente `@players`, `@shared`, etc. Evita `../../../../`.

---

## 4. Sistema de rutas (React Router)

Rutas anidadas con layouts, code-splitting por página (`React.lazy` + `Suspense`) y guards declarativos.

```
/                                → redirect a /dashboard (si auth) o /login
/login                           → AuthLayout > LoginPage
/onboarding                      → AuthLayout > OnboardingPage

/dashboard                       → AppShell > DashboardPage

/teams                           → AppShell > TeamsListPage
/teams/:teamId                   → AppShell > TeamDetailPage

/players                         → AppShell > PlayersListPage
/players/new                     → AppShell > PlayerFormPage
/players/:playerId               → AppShell > PlayerDetailPage
/players/:playerId/edit          → AppShell > PlayerFormPage
/players/:playerId/performance   → AppShell > PlayerPerformancePage

/trainings                       → AppShell > TrainingsCalendarPage
/trainings/:sessionId            → AppShell > SessionDetailPage

/matches                         → AppShell > MatchesListPage
/matches/:matchId                → AppShell > MatchDetailPage
/matches/:matchId/live            → AppShell > LiveMatchPage

/performance                     → AppShell > PerformanceHubPage

/injuries                        → AppShell > InjuriesListPage

/calendar                        → AppShell > CalendarPage

/reports                         → AppShell > ReportsPage

/settings                        → AppShell > SettingsPage

*                                → NotFoundPage
```

`routes.config.js` centraliza metadata de cada ruta (título, icono de nav, roles permitidos) para que `Sidebar`/`BottomNav` se generen dinámicamente en vez de hardcodear links. `ProtectedRoute` valida sesión (hoy: flag simple en `authStore`; mañana: token de Supabase). `RoleRoute` restringe por rol (`admin`, `coach`, `analyst`) reutilizando la misma infraestructura cuando se agreguen roles.

---

## 5. Gestión de estado (Zustand)

**Regla de oro:** un store por feature relevante, nunca un mega-store global. Cada store:
1. Expone estado + acciones.
2. Las acciones llaman al `service` correspondiente (nunca tocan storage directo).
3. Usa el middleware `persist` solo donde tenga sentido cachear en cliente (con la propia clave namespaced).

```
shared/store/uiStore.js        → theme, sidebarOpen, activeModal, toasts
features/auth/store            → currentUser, role, isAuthenticated
features/players/store         → players[], selectedPlayerId, filters, status
features/teams/store           → teams[], activeTeamId
features/trainings/store       → sessions[], selectedSessionId
features/matches/store         → matches[], liveMatchState
features/performance/store     → metrics[], comparisonSelection
features/injuries/store        → injuries[]
features/calendar/store        → events[] (derivado, agrega trainings+matches)
features/settings/store        → preferences (unidades, idioma, tema por defecto)
```

Patrón estándar de un store (descripción, sin código):
- `state`: datos normalizados (arrays de entidades + `status: 'idle'|'loading'|'error'`).
- `actions`: `fetchAll`, `create`, `update`, `remove`, `selectById` — todas async, delegan en el service.
- `selectors`: funciones puras exportadas aparte (`selectActivePlayers(state)`) para evitar recomputar en cada componente y facilitar testing.

Zustand se elige sobre Redux por su bajo boilerplate; se mantiene disciplina de "un store, una responsabilidad" para que escalar a `zustand` + `immer` o incluso migrar a otra librería en el futuro sea localizado.

---

## 6. Capa de servicios y modelos de datos

### 6.1 Adapter de persistencia (la pieza clave de escalabilidad)

```
StorageAdapter (interfaz)
  getAll(collection)
  getById(collection, id)
  query(collection, predicate)
  create(collection, entity)
  update(collection, id, patch)
  remove(collection, id)
  clear(collection)
```

- `LocalStorageAdapter` implementa esto hoy serializando JSON bajo claves `f7.<collection>.v1`.
- `SupabaseAdapter` / `SQLiteAdapter` implementarán la misma interfaz mañana (mismas firmas, `async` ya desde el día 1 aunque LocalStorage sea síncrono, para que el cambio sea transparente).
- `storageProvider.js` decide qué adapter instanciar según `config/env.js` (`VITE_STORAGE_DRIVER=localStorage|supabase|sqlite`).

### 6.2 Services de dominio

Cada feature con persistencia tiene un `*.service.js` que usa el adapter y aplica reglas de negocio (validaciones, cálculos derivados, relaciones entre entidades). Los stores **solo** hablan con services, nunca con el adapter directamente.

```
playerService.getAll() → StorageAdapter.getAll('players')
playerService.create(data) → valida modelo, genera id/timestamps, StorageAdapter.create(...)
performanceService.getTrend(playerId, metricType) → agrega y calcula tendencia
calendarService.getEvents(range) → agrega trainingService + matchService
```

### 6.3 Modelos de dominio (entidades principales)

Todos extienden conceptualmente `BaseEntity { id, createdAt, updatedAt }`.

- **Team**: `id, name, category, season, logoUrl, coachId, colorPrimary, colorSecondary`
- **Player**: `id, teamId, firstName, lastName, dorsalNumber, position, birthDate, height, weight, photoUrl, dominantFoot, status(active/injured/inactive)`
- **TrainingSession**: `id, teamId, date, type(physical/technical/tactical/recovery), durationMinutes, exercises[], attendance[{playerId, present}], notes`
- **Exercise**: `id, name, category, targetMetric, durationMinutes`
- **Match**: `id, teamId, date, opponent, isHome, competition, result{goalsFor, goalsAgainst}, lineup[{playerId, position, minutesPlayed}], events[]`
- **MatchEvent**: `id, matchId, playerId, type(goal/assist/yellowCard/redCard/substitution), minute`
- **PerformanceMetric**: `id, playerId, date, type(speed/endurance/strength/agility/vo2max/technical), value, unit, context(training/match/test)`
- **PhysicalTest**: `id, playerId, date, testType, resultValue, unit, notes`
- **Injury**: `id, playerId, type, bodyPart, severity(low/medium/high), startDate, endDate, status(active/recovering/resolved)`
- **CalendarEvent** *(derivado, no persistido directamente)*: `id, sourceType(training/match), sourceId, date, title`
- **User**: `id, name, email, role(admin/coach/analyst), teamIds[]`

Estos modelos se documentan como JSDoc typedefs (o se migran a TypeScript más adelante — ver §11) y viven en `models/` de cada feature para que el modelo sea la fuente de verdad tanto para formularios como para gráficas.

---

## 7. Componentes: organización y jerarquía

Dos capas claramente separadas:

1. **`shared/components/ui`** — Design System puro (Nike Training Club style): átomos sin conocimiento de dominio (`Button`, `Card`, `Modal`, `Badge`...). Reciben props genéricas, nunca importan un `store`.
2. **`features/<x>/components`** — componentes de dominio, compuestos a partir de los átomos de `ui/`, conscientes del modelo (`PlayerCard` sabe renderizar un `Player`, `MatchTimeline` sabe interpretar `MatchEvent[]`).

Jerarquía conceptual (atomic-design simplificado, sin sobre-ingeniería):

```
ui/ (átomos)  →  feature/components (moléculas/organismos de dominio)  →  feature/pages (plantillas completas)  →  app/layout (shell)
```

`shared/components/charts/` son wrappers finos sobre Chart.js: reciben `data` y `options` ya formados por hooks del feature (p.ej. `usePerformanceMetrics` devuelve datos listos para `LineChart`), manteniendo Chart.js desacoplado de la lógica de negocio.

`shared/components/motion/` centraliza patrones de Framer Motion (transición de página, fade-in de listas, stagger de cards) para que la animación sea consistente en toda la app y no se reinvente por pantalla.

---

## 8. Hooks personalizados

| Hook | Ubicación | Responsabilidad |
|---|---|---|
| `usePlayers`, `usePlayer(id)` | `features/players/hooks` | leer/mutar del `playersStore`, exponer `loading/error` |
| `useTrainingSessions` | `features/trainings/hooks` | listado + filtros por equipo/fecha |
| `usePerformanceMetrics(playerId)` | `features/performance/hooks` | trae métricas y las formatea para charts |
| `usePlayerComparison(playerIds[])` | `features/performance/hooks` | arma dataset comparativo (radar chart) |
| `useLocalStorage` | `shared/hooks` | wrapper genérico sync-con-estado (usado solo fuera del adapter, ej. preferencias UI simples) |
| `useMediaQuery` | `shared/hooks` | breakpoints responsive (`isMobile`, `isTablet`) |
| `useDebounce` | `shared/hooks` | inputs de búsqueda/filtros |
| `useOnlineStatus` | `shared/hooks` | estado de red, para banner offline (PWA) |
| `usePwaInstallPrompt` | `shared/hooks` | captura `beforeinstallprompt`, expone `promptInstall()` |
| `useDisclosure` | `shared/hooks` | abrir/cerrar modales/drawers de forma consistente |
| `useTheme` | `shared/theme` | lee/cambia tema desde `uiStore` |

Regla: un hook de feature nunca importa el store de otro feature directamente; si necesita datos cruzados (ej. `calendar` necesita trainings + matches), pasa por el `service` agregador de su propio feature (`calendarService`), no por los stores ajenos.

---

## 9. Sistema de temas

- **Tailwind config** define tokens base (`colors`, `fontSize`, `spacing`, `borderRadius`, `boxShadow`) leyendo de `shared/theme/tokens.js` como fuente única de verdad (evita duplicar valores entre JS y Tailwind).
- **Modo claro/oscuro**: estrategia `class` de Tailwind (`darkMode: 'class'`), controlada por `uiStore.theme` (`light | dark | system`), persistida en LocalStorage, aplicada como clase en `<html>` vía `ThemeProvider`.
- **Tema de marca por equipo (futuro):** `Team.colorPrimary/colorSecondary` pueden inyectarse como CSS variables (`--team-primary`) a nivel de `AppShell` cuando el usuario selecciona un equipo activo — permite personalizar acentos sin recompilar Tailwind.
- **Chart.js theming**: `shared/components/charts/chartTheme.js` lee los mismos tokens para que las gráficas respeten el tema activo (colores, grid, tooltip) automáticamente al cambiar claro/oscuro.
- **Motion tokens**: `shared/theme/motion.js` centraliza duraciones (`fast/base/slow`) y easings estándar para que Framer Motion sea consistente (transiciones de página, entrada de cards, micro-interacciones de botones).
- **Tipografía**: escala tipográfica definida una vez en tokens, aplicada vía clases utilitarias Tailwind (`text-heading-lg`, etc. si se decide extender el theme con nombres semánticos).

---

## 10. Assets e iconos (PWA)

- `public/icons/`: set completo de iconos PWA (72 a 512px + maskable) generados desde el logo maestro en `src/assets/logos/`.
- `public/manifest.webmanifest`: `name`, `short_name`, `theme_color`, `background_color`, `display: standalone`, `orientation`, `icons[]`, `shortcuts[]` (accesos directos a "Nuevo entrenamiento", "Ver dashboard").
- `vite-plugin-pwa` genera el service worker (estrategia `generateSW` inicialmente; migrar a `injectManifest` si se necesita control fino de caché offline de datos).
- Estrategia de caché: `CacheFirst` para assets estáticos/iconos, `NetworkFirst` (o `StaleWhileRevalidate`) para futuras llamadas a Supabase, con página `offline.html` de fallback.
- `src/assets/icons/` (SVGs propios usados dentro de la UI, ej. iconografía de posiciones de juego) se mantiene separado de `public/icons` (que es exclusivamente para el manifest PWA) para no mezclar responsabilidades.

---

## 11. Buenas prácticas transversales

- **Imports absolutos** (`@/features/...`, `@/shared/...`) configurados en Vite; prohibido `../../../..`.
- **Barrel exports** (`index.js`) por feature como única superficie pública — refuerza el aislamiento entre dominios.
- **Lint + format**: ESLint (reglas React Hooks + import/order) y Prettier, con Husky + lint-staged en pre-commit desde el primer commit del proyecto.
- **JSDoc typedefs ahora, TypeScript después**: se documentan modelos y props con JSDoc para tener autocompletado/seguridad de tipos sin la fricción inicial de configurar TS; la estructura de carpetas es 1:1 compatible con una migración a `.tsx` cuando el proyecto lo justifique.
- **Testing**: Vitest + React Testing Library. Tests colocados junto al código (`Component.test.jsx`) o en `src/test` para fixtures/mocks compartidos. Prioridad: services (lógica pura) > stores > componentes críticos.
- **Error boundaries** por sección (`AppShell` envuelve el `Outlet` en un `ErrorBoundary` genérico; features críticos como `LiveMatchPage` pueden tener el suyo).
- **Code-splitting** por página vía `React.lazy`, con `Suspense` + skeleton loaders (`shared/components/ui/Skeleton`) en vez de spinners genéricos.
- **Accesibilidad**: componentes `ui/` construidos sobre elementos semánticos y atributos ARIA desde el inicio (no como parche posterior).
- **Datos de ejemplo**: `src/test/mocks/seed.js` con dataset realista (jugadores, entrenamientos, partidos) para desarrollar UI sin depender de introducir datos manualmente cada vez; un botón "cargar datos demo" en `Settings` puede usarlo en dev.
- **Feature flags simples** (`config/app.config.js`) para activar/desactivar features en construcción sin ramas de larga vida.

---

## 12. Escalabilidad futura (roadmap arquitectónico)

| Fase | Cambio | Impacto en la arquitectura |
|---|---|---|
| **Fase 1 (actual)** | LocalStorage, sin auth real, single-user | `LocalStorageAdapter`, `authStore` simulado |
| **Fase 2** | Migración a Supabase (Postgres + Auth + Realtime) | Se implementa `SupabaseAdapter` (misma interfaz `StorageAdapter`) → cero cambios en stores/componentes. `authStore` pasa a usar Supabase Auth. |
| **Fase 3** | Multi-equipo / multi-club (multi-tenant) | Se añade `clubId` a los modelos base y filtros por tenant en services; `RoleRoute` gana granularidad (admin de club vs coach de equipo) |
| **Fase 4** | Roles y permisos avanzados | Tabla de permisos en Supabase (RLS), `RoleRoute`/`ProtectedRoute` ya preparados desde Fase 1 |
| **Fase 5** | App nativa (iOS/Android) vía Capacitor | La estructura `features/*` y `shared/*` es agnóstica de plataforma; solo cambia `app/` (shell nativo) y se añade `SQLiteAdapter` para almacenamiento offline-first en nativo |
| **Fase 6** | Sync offline-first con resolución de conflictos | Se añade una capa `sync/` en `shared/services` que orquesta entre `LocalStorageAdapter`/`SQLiteAdapter` (caché local) y `SupabaseAdapter` (remoto), con cola de cambios pendientes |
| **Fase 7** | Analítica avanzada / insights con IA | Nuevo feature `insights/` que consume `performanceService` + `matchService` vía agregación, sin tocar el resto |
| **Fase 8** | Backend propio (si Supabase se queda corto) | `shared/services/api/httpClient.js` ya reservado; se implementa `ApiAdapter` siguiendo la misma interfaz |
| **Fase 9** | Monorepo (web + mobile + backend) | La separación `features/shared/app` ya hecha permite extraer `shared/` y `features/*` a paquetes de un monorepo (Turborepo/Nx) sin refactor mayor |

**El principio subyacente en todas las fases:** cualquier cambio de infraestructura (backend, plataforma, sync) se absorbe en la capa de `services/adapters`. Componentes, hooks y stores nunca deberían necesitar cambiar por una migración de backend — solo por cambios de producto/UX.

---

## 13. Resumen ejecutivo de la arquitectura

- **Organización:** feature-first (`features/*`) + capa compartida (`shared/*`) + bootstrap (`app/*`).
- **Estado:** Zustand, un store por feature, acciones que delegan en services.
- **Datos:** modelos explícitos por entidad + capa de persistencia abstraída (`StorageAdapter`) intercambiable sin tocar UI.
- **UI:** Design System propio en `shared/components/ui`, componentes de dominio en cada feature, animaciones centralizadas con Framer Motion, gráficas con wrappers de Chart.js theming-aware.
- **Rutas:** React Router con layouts anidados, guards de auth/rol, code-splitting por página.
- **Temas:** tokens únicos consumidos por Tailwind, Chart.js y Framer Motion — claro/oscuro + personalización futura por equipo.
- **PWA:** manifest + service worker + iconografía completa desde el día 1.
- **Escalabilidad:** cada eje de crecimiento (backend, multi-tenant, nativo, sync, IA) tiene un punto de extensión ya previsto en la arquitectura, sin necesidad de reescrituras.

Este documento es la referencia obligatoria antes de escribir la primera línea de código: cualquier carpeta, componente o store que se cree debe encajar en esta estructura o justificar explícitamente por qué la extiende.
