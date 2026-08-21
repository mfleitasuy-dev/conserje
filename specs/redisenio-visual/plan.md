# PLAN — Rediseño visual en tema oscuro

> Plan final derivado de [`spec.v2.md`](./spec.v2.md), regenerado sin supuestos nuevos
> (G1–G8 cerrados, ver [`gaps.md`](./gaps.md)). Pensado para ejecutarse en una **sesión limpia**.

## 0. Arranque de la sesión de ejecución

1. Leer `CLAUDE.md`, [`spec.v2.md`](./spec.v2.md) (sobre todo §2 criterios y §3 tokens) y este
   plan. La referencia visual es el shot de Dribbble linkeado en la spec; la lectura ya está
   hecha en `spec.v1.md` §3 — no hace falta volver a abrirlo.
2. Invocar la skill **`ui-ux-pro-max`**. Usarla por su **checklist** (contraste 4.5:1, focus
   visible, touch 44 px, `prefers-reduced-motion`, labels, responsive 375/768/1024/1440) y por
   consultas puntuales con
   `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain ux|color|typography`.
   **No** usar `--design-system`: paleta y fuentes ya están decididas (G1, G2).
3. Invocar la skill **`design-taste-frontend`** y declarar el *Design Read* antes de tocar CSS:
   > Reading this as: redesign de un panel operativo de kiosko (portería), con lenguaje
   > dark-monochrome + un acento salvia, referencia "Smart Energy Dashboard" (Zajno), leaning
   > toward CSS puro con tokens, Fira Sans + Fira Code, motion mínimo.
   Dials: `DESIGN_VARIANCE 4 / MOTION_INTENSITY 2 / VISUAL_DENSITY 6`. Aplicar su disciplina
   anti-default (§0.D) y el pre-flight final.
4. Trabajar con `npm run dev` levantado; al final correr los subagentes **`test-runner`** y
   **`ui-reviewer`**.

## 1. Cambios por archivo

### `app/globals.css` *(U1, U3, U4, U5, E2, E3, E4, S1, S2, UN2)*

- Reescritura completa. `:root` con **todos** los tokens de la tabla de `spec.v2.md` §3
  (incluidos los alias `--brand`/`--brand-dark` y `--shadow-*: none`) y `color-scheme: dark`.
- Conservar por nombre todas las clases actuales: `topbar brand container cards card num
  num.txt lbl panel table badge ok busy sev-baja sev-media sev-alta neutral stack label input
  select button ghost spinner error grid-spots spot name kind empty subtitle muted footer
  footer-inner footer-copy` (+ las de Toast).
- Nuevas: `.page-head` (flex, título izq. / reloj der., `.clock` con hora en Fira Code y fecha
  en `--muted`), `.bento` (grid 12 col; `.card` = `span 3`, `.card.accent` = `span 6`;
  ≤ 1024 px `span 6/12`; ≤ 600 px una columna), `.card.accent`, `.table-wrap { overflow-x:auto }`,
  `.pill` (compartida por `button` y chips).
- `.topbar`: fondo `var(--bg)`, `border-bottom: 1px solid var(--line)`, nav de texto con
  estado activo subrayado fino; ≤ 600 px la nav es fila con `overflow-x: auto` (E4).
- `.card/.panel/.spot`: borde 1px, radio, **sin sombra**; `.card .num` en Fira Code 300,
  `clamp(2.25rem, 4vw, 3rem)`; `.spot` con variantes `ok|busy` solo en borde/texto/ícono (E3).
- Tablas: `th` en `--muted` 12 px mayúsculas con tracking, filas con hover `--panel-2`.
- Forms: `input/select/textarea` fondo `--panel-2`, borde `--line`, focus `--ring`.
- `button` pill relleno / `button.ghost` pill outline con los cuatro estados (U4).
- `.badge` con `display:inline-flex; gap` para ícono + texto; familias `ok|warn|busy|neutral`.
- `@media (prefers-reduced-motion: reduce)`: sin transiciones, `.spinner` sin animación (S2).

### `app/layout.tsx` *(U2, E1, E4)*

- `Fira_Code({ weight: ["300","400","500","600"] })`.
- Topbar plano con `BuildingIcon` + nav de texto.
- Debajo del topbar, `<div className="page-head"><Clock /></div>` alineado a la derecha. El
  `h1 + p.subtitle` sigue viviendo en cada página, inmediatamente debajo: así no hay que mover
  el título de las 6 páginas al layout (E1).
- Footer sobrio (texto `--muted`, borde superior `--line`).

### `app/ui/Clock.tsx` (nuevo, `"use client"`) *(E1, UN3)*

- `useState<Date | null>(null)`; en `useEffect` setea la fecha y un `setInterval` de 60 000 ms;
  limpia al desmontar. Mientras es `null` renderiza `—` en ambos spans.
- Markup: `<div className="clock"><span className="clock-time">{horaCorta(d)}</span>
  <span className="clock-date">{fechaLarga(d)}</span></div>` con `aria-live="off"`.

### `lib/format.ts` *(E1)*

- Agregar `horaCorta(d: Date): string` (`Intl.DateTimeFormat("es-UY", { hour: "2-digit",
  minute: "2-digit", hour12: false })`) y `fechaLarga(d: Date): string` (`{ day: "numeric",
  month: "long" }`). Funciones puras; no tocar las existentes.

### `app/page.tsx` *(E2, U3, S1)*

- Envolver las KPI en `<section className="cards bento">`; la card "Visitas en el edificio"
  pasa a `className="card accent"`.
- Paneles de tabla envueltos en `<div className="table-wrap">`.

### `app/parking/page.tsx` *(E3, U3)*

- KPI "Cocheras libres" con `card accent` (dato de `parkingSummary`, ya disponible).
- Cada `.spot` agrega el ícono (`CheckCircleIcon` libre / `CarIcon` ocupada) y el texto de
  estado junto a `.kind`.

### `app/alertas/page.tsx`, `app/denuncias/page.tsx` *(U3)*

- Una `card accent` arriba del form con el conteo de activas / abiertas
  (`listActiveAlerts(db).length` / `complaintsSummary(db).abiertas`, ya en `lib/`).
- Tablas en `.table-wrap`.

### `app/porteria/page.tsx`, `app/noticias/page.tsx` *(S1)*

- Solo `.table-wrap` alrededor de las tablas. Sin KPI de acento.

### Client components *(U4)*

`app/porteria/VisitForm.tsx`, `ExitButton.tsx`; `app/parking/AssignForm.tsx`, `FreeButton.tsx`;
`app/noticias/NewsForm.tsx`; `app/alertas/AlertForm.tsx`, `ResolveButton.tsx`;
`app/denuncias/ComplaintForm.tsx`, `ResolveButton.tsx`:

- Acción principal con `className="button"`; acciones de fila (salida, liberar, resolver)
  con `className="button ghost"`. **Solo `className`**; la lógica `fetch → notify →
  router.refresh()` no cambia.

### `app/ui/Toast.tsx` *(U1)*

- Sin cambios de lógica; las clases se restilan en `globals.css` (fondo `--panel-2`, borde
  `--line`, variante `error` con `--busy-border`).

### `app/icons.tsx`

- Solo si falta alguno: `ClockIcon` para el encabezado. Mismo estilo (24×24, stroke 1.75).

### `prompts/redisenio-ui.md`

- Una línea al inicio: "Sistema vigente: ver `specs/redisenio-visual/spec.v2.md` (tema oscuro);
  esta plantilla describe el rediseño anterior (tema claro)".

## 2. Tests y verificación

| Criterio | Test / evidencia |
| --- | --- |
| E1 | `tests/format.test.ts` (nuevo): `horaCorta(new Date(2026, 8, 9, 11, 37)) === "11:37"`, `fechaLarga(new Date(2026, 8, 9)) === "9 de setiembre"` |
| UN1 | `npm test` verde (suite existente intacta) y `npm run build` → `✓ Compiled successfully`; `curl` a `/api/visits` y `/api/parking` devuelve el mismo JSON que antes |
| UN2 | Tabla de contraste por par (`--text`/`--bg`, `--muted`/`--panel`, `--on-accent`/`--accent`, `--ok`/`--panel`, `--warn`/`--panel`, `--busy`/`--panel`) calculada con un script de luminancia WCAG; todos ≥ 4.5:1 |
| E2, E3, E4, S1, U3, U4 | Reporte de `ui-reviewer` sobre `/`, `/porteria`, `/parking`, `/noticias`, `/alertas`, `/denuncias` a **375** y **1440** px: sin scroll horizontal de página, sin errores de consola, labels asociados, una sola card de acento por pantalla |
| S2 | Captura con `prefers-reduced-motion: reduce` emulado (Playwright `emulateMedia`): sin transiciones ni spinner |
| UN3 | `curl -s localhost:3000/ \| grep -c "—"` ≥ 2 (SSR del reloj) y sin warning de hidratación en consola |

## 3. Fuera de scope (antipatrones de la spec)

Gráficos y series, ilustración 3D, toggles, menú de cuenta/auth, tema claro o conmutador,
Tailwind o librerías de UI, cambios en `lib/` (salvo `format.ts`), APIs, schema o tests
existentes.

## 4. Cierre

Al terminar, escribir `specs/redisenio-visual/evidencia.md` con el formato de las otras
features (tabla archivo/cambio, salida literal de Vitest y del build, tabla de contrastes,
reporte de `ui-reviewer`, commit) y cambiar el estado de `redisenio-visual` en
`specs/README.md` a **Ejecutada**.
