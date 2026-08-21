# SPEC — Rediseño visual en tema oscuro (v1)

> Spec ejecutable inicial. El ciclo completo vive en esta carpeta:
> [`gaps.md`](./gaps.md) → [`spec.v2.md`](./spec.v2.md) → [`plan.md`](./plan.md) → `evidencia.md`.
>
> **Referencia visual:** [Smart Energy Dashboard Concept](https://dribbble.com/shots/25108413-Smart-Energy-Dashboard-Concept)
> (Bohdan Ratiiev para Zajno, Dribbble). Ver la lectura detallada en la sección 3.

---

## 1. Problema y objetivo

**Problema.** La UI actual es un panel claro azul de "admin genérico" (fondo celeste, topbar
azul oscuro, cards blancas con sombra). Funciona, pero no transmite identidad de producto y se
ve como cualquier plantilla.

**Objetivo.** Rediseñar la **capa visual de todas las pantallas** (layout/topbar, dashboard,
portería, cocheras, noticias, alertas, denuncias) adoptando el lenguaje del shot de referencia:
**tema oscuro carbón, cards bordeadas sin sombra, un acento verde salvia pálido, numerales
grandes monoespaciados y controles tipo pill** — sin tocar la lógica de dominio (`lib/`), las
APIs, el schema ni los tests existentes, y conservando los nombres de clase que ya usa el markup.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall usar un **único tema oscuro** definido con tokens
  semánticos (CSS variables) en `:root` de `app/globals.css`; los componentes no usan colores
  hexadecimales sueltos.
- **U2 (ubicuo).** The system shall usar una tipografía **sans** para texto y labels y una
  **monoespaciada ligera** para numerales grandes (KPI), identificadores de cochera y horas.
- **U3 (ubicuo).** The system shall renderizar cards y paneles **sin sombra**, con borde de 1px
  sutil y radio consistente; como máximo **una card de acento** (relleno salvia, texto oscuro)
  por pantalla, reservada a la métrica accionable.
- **U4 (ubicuo).** The system shall usar botones **pill**: primario relleno en acento con texto
  oscuro; secundario (`ghost`) outline con borde 1px y fondo transparente. Ambos con estados
  `:hover`, `:focus-visible`, `:disabled` visibles.
- **E1 (event-driven).** WHEN se abre cualquier ruta, el topbar es **plano** (logo + nav de
  texto sobre el mismo fondo, separado por una línea) y debajo hay una **fila de encabezado**
  con el título de la página a la izquierda y la **hora y fecha actuales** a la derecha.
- **E2 (event-driven).** WHEN se abre el dashboard, las KPI y los paneles se disponen en una
  **bento grid** (tarjetas de distinto ancho) que colapsa a una columna en mobile.
- **S1 (state-driven / optional).** WHERE una lista no tiene datos, el estado vacío (`.empty`)
  mantiene el estilo (ícono + texto centrado dentro del panel), sin card "fantasma".
- **UN1 (unwanted, IF…THEN).** IF se aplica el rediseño, THEN `npm test` sigue verde, `npm run
  build` compila y ninguna respuesta de `/api/*` cambia.
- **UN2 (unwanted, IF…THEN).** IF un par texto/fondo queda por debajo de **4.5:1** (WCAG AA),
  THEN no se acepta: se ajusta el token antes de cerrar.

## 3. Ejemplos de entrada y salida

### Lectura de la referencia (qué se copia)

| Elemento | En el shot | En Conserje |
| --- | --- | --- |
| Fondo de página | Carbón casi negro (`≈#121412`) | `body` con `--bg` oscuro; sin gradientes |
| Cards | Superficie apenas más clara, borde 1px `rgba(255,255,255,.08)`, radio ~12–14px, sin sombra | `.card`, `.panel`, `.spot` |
| Card de acento | Salvia pálido (`≈#DCE5D9`) con texto oscuro ("Tracking", "Green energy usage") | `.card.accent` para la KPI accionable |
| Numerales | Mono ligera ~40–48px ("52–71", "47%", "5.7") | `.card .num`, `.spot .name` |
| Labels | Gris verdoso 12–13px ("kWh per month") | `.card .lbl`, `.muted` |
| Topbar | Logo + nav de texto plano; metadatos a la derecha | `.topbar` sin fondo de color; reloj |
| Fila de encabezado | `Overview · 11:37 AM Time · 9 September` | `h1` + hora `HH:mm` + fecha larga |
| Controles | Pills outline ("Change module", "Week ↓"), menú "···" | `button`, `button.ghost` |
| Mobile | Cards en una columna, nav colapsada | `@media (max-width: 600px)` |

### Antes → después (descriptivo)

```
Dashboard (antes): fondo celeste, 7 cards blancas con sombra en grilla uniforme, topbar azul.
Dashboard (después): fondo carbón, bento grid — "Visitas en el edificio" en card salvia grande
  con numeral mono 48px; el resto en cards bordeadas; paneles de tabla con filas hover sutil.

Portería (antes): panel blanco con form y tabla.
Portería (después): mismo markup; form con inputs oscuros bordeados, botón pill salvia
  "Registrar"; tabla con hora en mono y badge "En el edificio" con ícono + texto.
```

## 4. Edge cases y errores

- **Tablas anchas en 375px** → scroll horizontal **dentro del panel** (`overflow-x: auto`),
  nunca de la página.
- **Estados `ok` / `busy` / severidad** → ícono + texto, no solo color (sobre fondo oscuro el
  color se pierde más).
- **`prefers-reduced-motion`** → sin transiciones ni spinners animados.
- **Toasts** → legibles sobre fondo oscuro, con contraste propio (no heredan `--panel` sin más).
- **Controles nativos** (`select`, `input[type=date]`) → deben verse oscuros (`color-scheme`).
- **Primer render del reloj** → no puede producir mismatch de hidratación.

## 5. Antipatrones (qué NO hacer)

- **No** introducir Tailwind, CSS-in-JS ni librerías de componentes: todo sigue en
  `app/globals.css` con variables y clases propias.
- **No** renombrar ni eliminar clases existentes (`topbar brand container cards card num lbl
  panel table badge stack label input select button ghost spinner error grid-spots spot name
  kind empty subtitle muted footer footer-inner footer-copy`); solo agregar.
- **No** tocar `lib/` (salvo helpers puros de formato), `app/api/**`, `db/`, ni `mcp/`.
- **No** gradientes "AI-purple" ni mesh, **no** glassmorphism, **no** sombras grandes, **no**
  emojis como íconos (solo SVG de `app/icons.tsx`).
- **No** gráficos de barras ni series "de relleno": no hay datos históricos; **no** copiar la
  ilustración 3D, los toggles decorativos ni el menú de cuenta (no hay auth, ADR-002).
- **No** tema claro ni conmutador de tema → fuera de scope.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- `app/globals.css` reescrito completo (tokens + clases), `app/layout.tsx` (fuentes, topbar,
  encabezado con reloj), ajustes **mínimos** de markup en `app/page.tsx` y las 5 páginas.
- Íconos SVG inline de `app/icons.tsx` (agregar los que falten con el mismo estilo).
- Skills a usar en la ejecución: **`ui-ux-pro-max`** (checklist de accesibilidad, estados,
  responsive, reduced-motion) y **`design-taste-frontend`** (disciplina anti-default, pre-flight).
- QA visual con el subagente **`ui-reviewer`** (Playwright) sobre las 6 rutas; suite con
  **`test-runner`**.
- Mensajes y textos en español neutro; identificadores en inglés.
