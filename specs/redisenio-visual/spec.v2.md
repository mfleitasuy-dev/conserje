# SPEC — Rediseño visual en tema oscuro (v2, refinado)

> Versión **refinada** de [`spec.v1.md`](./spec.v1.md): incorpora como criterios EARS
> explícitos las decisiones que en v1 quedaban implícitas
> (ver [`gaps.md`](./gaps.md), gaps G1–G8). El plan de ejecución está en [`plan.md`](./plan.md).
>
> **Referencia visual:** [Smart Energy Dashboard Concept](https://dribbble.com/shots/25108413-Smart-Energy-Dashboard-Concept)
> (Bohdan Ratiiev para Zajno). Lectura detallada en `spec.v1.md` §3.

---

## 1. Problema y objetivo

**Problema.** La UI actual es un panel claro azul de "admin genérico" que no transmite
identidad de producto.

**Objetivo.** Rediseñar la capa visual de **todas las pantallas** en un **único tema oscuro**
con el lenguaje del shot de referencia (carbón, cards bordeadas sin sombra, un acento salvia,
numerales mono, pills), sin tocar dominio, APIs ni schema, y conservando los nombres de clase.

## 2. Criterios de aceptación (EARS)

### Ubicuos

- **U1.** The system shall definir el tema con los **tokens** de la sección "Tokens" en `:root`
  de `app/globals.css`; ningún componente usa colores sueltos. Los tokens existentes conservan
  su nombre (`--brand`/`--brand-dark` pasan a ser alias de `--accent`). *(G2)*
- **U2.** The system shall usar **Fira Sans** para texto y **Fira Code** (pesos 300–600, vía
  `next/font/google`) para numerales KPI (`.card .num`), identificadores de cochera
  (`.spot .name`) y horas en tablas. Sin fuentes ni dependencias nuevas. *(G1)*
- **U3.** The system shall renderizar `.card`, `.panel` y `.spot` **sin sombra**, con
  `border: 1px solid var(--line)` y `border-radius: var(--radius)`; y exactamente **una**
  `.card.accent` (relleno `--accent`, texto `--on-accent`) por pantalla: dashboard → "Visitas en
  el edificio", cocheras → "Cocheras libres", alertas → "Alertas activas", denuncias →
  "Denuncias abiertas"; portería y noticias sin acento. *(G4)*
- **U4.** The system shall estilar `button` como **pill** rellena (`--accent` / `--on-accent`)
  y `button.ghost` como pill outline (borde `--line`, fondo transparente, texto `--text`), ambas
  con `:hover`, `:focus-visible` (`--ring`) y `:disabled` distinguibles, `cursor: pointer`,
  altura mínima 44 px y transición 150–200 ms solo en `color/background/opacity/transform`.
- **U5.** The system shall declarar `color-scheme: dark` en `:root`; no existe tema claro ni
  conmutador. *(G6)*

### Event-driven

- **E1.** WHEN se abre cualquier ruta, el topbar es **plano** (sin fondo de color, separado del
  contenido por `border-bottom: 1px solid var(--line)`) con logo + nav de texto, y debajo una
  fila `.page-head` con el `h1` a la izquierda y el componente client `Clock` a la derecha
  mostrando hora `HH:mm` y fecha larga (`es-UY`), actualizados cada minuto. *(G3)*
- **E2.** WHEN se abre el dashboard, las KPI se disponen en `.bento` (grid de 12 columnas:
  la card de acento ocupa 2 columnas de card, el resto 1) y los paneles de tabla debajo; bajo
  600 px todo colapsa a una columna.
- **E3.** WHEN se abre `/parking`, cada `.spot` es una mini-card bordeada: libre = borde/texto
  familia `ok` + `CheckCircleIcon` + texto "Libre"; ocupado = familia `busy` + `CarIcon` +
  texto "Ocupada". El identificador va en Fira Code. Sin rellenos sólidos. *(G5)*
- **E4.** WHEN el viewport es menor a 600 px, la nav del topbar se vuelve una fila horizontal
  con `overflow-x: auto` (sin JS ni menú hamburguesa). *(G8)*

### State-driven

- **S1.** WHERE una lista no tiene datos, `.empty` muestra ícono + texto centrados dentro del
  panel, con `--muted`, sin card adicional.
- **S2.** WHERE el usuario tiene `prefers-reduced-motion: reduce`, no hay transiciones ni
  animación de spinner (se muestra el texto "Enviando…" estático).

### Unwanted

- **UN1.** IF se aplica el rediseño, THEN `npm test` sigue verde, `npm run build` compila y
  ninguna respuesta de `/api/*` cambia. *(G7)*
- **UN2.** IF un par texto/fondo de la tabla de tokens queda por debajo de **4.5:1**, THEN el
  token se corrige antes de cerrar; la tabla de contrastes va en `evidencia.md`. *(G2, G7)*
- **UN3.** IF `Clock` aún no montó en el cliente (SSR / sin JS), THEN renderiza `—` en hora y
  fecha, sin error de hidratación ni romper la página. *(G3)*

## 3. Ejemplos de entrada y salida

### Tokens (antes → después)

| Token | Antes (claro) | Después (oscuro) | Uso |
| --- | --- | --- | --- |
| `--bg` | `#eff6ff` | `#121412` | body |
| `--panel` | `#ffffff` | `#171A18` | cards, paneles, spots |
| `--panel-2` | — (nuevo) | `#1D211E` | hover de fila, fondo de inputs |
| `--line` | `#e2e8f0` | `rgba(255,255,255,.08)` | bordes |
| `--text` | `#0c4a6e` | `#ECEFEA` | texto |
| `--heading` | `#0c2a45` | `#F5F7F3` | h1/h2 |
| `--muted` | `#475569` | `#9AA39B` | labels, subtítulos |
| `--accent` | `#0ea5e9` | `#DCE5D9` | card de acento, botón primario, focus |
| `--on-accent` | — (nuevo) | `#121412` | texto sobre acento |
| `--brand`, `--brand-dark` | `#0369a1`, `#075985` | alias de `--accent` | compatibilidad |
| `--topbar` | `#0c2a45` | `var(--bg)` | topbar plano |
| `--ok` / `--ok-bg` / `--ok-border` | `#15803d` / `#dcfce7` / `#bbf7d0` | `#9FD6A8` / `rgba(159,214,168,.12)` / `rgba(159,214,168,.35)` | libre, sev. baja |
| `--warn` / `--warn-bg` / `--warn-border` | — (nuevo) | `#E8C98A` / `rgba(232,201,138,.12)` / `rgba(232,201,138,.35)` | sev. media |
| `--busy` / `--busy-bg` / `--busy-border` | `#b91c1c` / `#fee2e2` / `#fecaca` | `#F2A5A0` / `rgba(242,165,160,.12)` / `rgba(242,165,160,.35)` | ocupada, sev. alta |
| `--radius` / `--radius-sm` | `14px` / `9px` | `14px` / `10px` | cards / inputs, badges |
| `--radius-pill` | — (nuevo) | `999px` | botones, chips |
| `--shadow-sm` / `--shadow-md` | sombras | `none` | se conservan por compatibilidad |
| `--ring` | azul | `0 0 0 3px rgba(220,229,217,.35)` | focus |

### Helpers de formato

```
horaCorta(new Date(2026, 8, 9, 11, 37))  → "11:37"
fechaLarga(new Date(2026, 8, 9))         → "9 de setiembre"
```

### Antes → después

```
Dashboard: fondo carbón; .bento con "Visitas en el edificio" en card salvia (numeral Fira Code
  300, 48px), 6 cards bordeadas; paneles "Alertas activas" y "Visitas ahora" con filas hover.
Cocheras: KPI "Cocheras libres" en acento; .grid-spots con mini-cards bordeadas (ícono + texto).
Portería / Noticias: mismo markup, sin KPI; form oscuro, botón pill salvia.
Alertas / Denuncias: KPI de acento con el conteo activo/abierto arriba del form.
```

## 4. Edge cases y errores

- **Tablas anchas en 375 px** → scroll dentro de `.table-wrap` (`overflow-x: auto`); la página
  no scrollea horizontalmente.
- **Estados no solo por color** → badges `ok|busy|sev-*|neutral` llevan ícono + texto.
- **Toasts** → fondo `--panel-2`, borde `--line`, texto `--text`; variante `error` con borde
  `--busy-border`.
- **Controles nativos** → `color-scheme: dark` + fondo `--panel-2` y borde `--line` en `input`,
  `select`, `textarea`.
- **Reloj** → `—` hasta montar (UN3); actualización con `setInterval` de 60 s, limpiado en
  `useEffect`.

## 5. Antipatrones (qué NO hacer)

- **No** Tailwind, CSS-in-JS ni librerías de componentes.
- **No** renombrar ni eliminar clases existentes; solo agregar (`accent`, `bento`, `page-head`,
  `table-wrap`, `pill`…).
- **No** tocar `lib/` (salvo `lib/format.ts`), `app/api/**`, `db/`, `mcp/`, ni los tests
  existentes.
- **No** gradientes, mesh, glassmorphism, sombras grandes, emojis como íconos.
- **No** gráficos de barras ni series de relleno, ilustración 3D, toggles decorativos, menú de
  cuenta (sin auth, ADR-002), tema claro o conmutador.
- **No** usar `--design-system` de `ui-ux-pro-max` para decidir paleta o fuentes: ya están
  decididas (G1, G2). La skill se usa por su checklist y `--domain`.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- `app/globals.css` reescrito completo con los tokens de §3 y todas las clases actuales.
- `app/layout.tsx`: Fira Code pesos `300 400 500 600`; topbar plano; `.page-head` con `Clock`.
- `app/ui/Clock.tsx` (client) + `horaCorta`/`fechaLarga` en `lib/format.ts` +
  `tests/format.test.ts`.
- Markup mínimo en `app/page.tsx` y las 5 páginas; solo `className` en los client components.
- Skills: `ui-ux-pro-max` (checklist, `--domain ux|color|typography`) y
  `design-taste-frontend` (pre-flight anti-default). QA: subagentes `ui-reviewer` y
  `test-runner`.
- Español neutro en textos; identificadores en inglés.

---

### Changelog v1 → v2

Cerrados los gaps G1–G8 (ver [`gaps.md`](./gaps.md)): fuentes Fira sin dependencias nuevas
(U2), tabla de tokens fija (U1/UN2), reloj como client component con fallback `—` (E1/UN3),
una sola card de acento por pantalla y cuáles (U3), spots bordeados sin relleno (E3), sin tema
claro y `color-scheme: dark` (U5), estrategia de verificación para un cambio visual (UN1/UN2),
nav mobile con scroll sin JS (E4). Al regenerar el plan sobre v2, **no aparecen supuestos
nuevos** → spec listo.
