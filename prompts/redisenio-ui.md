# Plantilla: redisenio-ui

**Cuándo usarlo:** cuando querés mejorar la capa visual de Conserje (paleta, tipografía,
jerarquía, estados, robustez de los elementos) para que deje de verse pobre, **sin** cambiar
la arquitectura ni la lógica de dominio. Reescribe `app/globals.css` y refina el markup de las
páginas conservando los nombres de clase existentes.

**Variables:**

- `{{ALCANCE}}` — qué páginas rediseñar. Default: todas (`app/layout.tsx`, `app/page.tsx`,
  `app/porteria/*`, `app/parking/*`).
- `{{TEMA}}` — `claro` (default) u `oscuro`.

**Ejemplo de uso:** "Rediseñá toda la UI, tema claro" → `{{ALCANCE}}=todas`, `{{TEMA}}=claro`.

**Sistema de diseño de referencia:** generado con la skill `ui-ux-pro-max`
(`scripts/search.py "... dashboard admin panel ..." --design-system`). Estilo
*Data-Dense Dashboard*, paleta azul seguridad + verde, tipografía Fira.

---

```xml
<rol>
Sos un desarrollador frontend senior de React/Next.js con buen ojo para dashboards
operativos limpios, accesibles y con jerarquía visual fuerte. Trabajás en CSS puro.
</rol>

<contexto>
Conserje es un panel de portería + cocheras (Next.js 15 App Router, TypeScript).
NO usa Tailwind ni librerías de UI: todo el estilo vive en app/globals.css con clases
utilitarias propias. Clases actuales que el markup ya usa y que DEBÉS conservar por nombre:
topbar, brand, container, cards, card (.num/.lbl), panel, table (th/td), badge ok|busy,
stack, label, input, select, button, button.ghost, error, grid-spots, spot (.name/.kind),
subtitle, muted.

Tokens actuales en :root: --bg --panel --muted --line --brand --brand-dark --ok --ok-bg
--busy --busy-bg --text.

Las páginas son server components con `export const dynamic = "force-dynamic"` (leen vía
lib/). Los interactivos son client ("use client") y usan fetch contra /api/* + router.refresh()
tras una mutación OK (ej. app/porteria/VisitForm.tsx, app/porteria/ExitButton.tsx,
app/parking/AssignForm.tsx).
</contexto>

<tarea>
Rediseñá la capa visual de {{ALCANCE}} en tema {{TEMA}}: reescribí app/globals.css y aplicá
los ajustes de markup mínimos necesarios, CONSERVANDO los nombres de clase existentes (no
rompas las páginas) y agregando solo refinamientos (íconos SVG, estados, contenedores).
</tarea>

<sistema-de-diseno>
Estilo: "Data-Dense Dashboard" — KPI cards claras, tablas legibles, grilla eficiente,
jerarquía marcada, espaciado consistente. Evitá ornamentación y diseño recargado.

Paleta (redefiní las CSS variables en :root manteniendo los nombres de token):
- --brand (primario):       #0369A1
- --brand-dark (hover):     #075985
- secundario/acento:        #0EA5E9   (agregá --accent)
- CTA/éxito (verde):        #22C55E   (mapeá --ok a esta familia; --ok #16A34A, --ok-bg #DCFCE7)
- ocupado (rojo):           --busy #DC2626, --busy-bg #FEE2E2  (sin cambios semánticos)
- fondo de página:          #F0F9FF   (body)
- superficie (--panel):     #FFFFFF
- texto (--text):           #0C4A6E
- muted (--muted):          #475569   (contraste ≥ 4.5:1 sobre blanco)
- líneas (--line):          #E2E8F0
Agregá tokens de profundidad y ritmo: --shadow-sm, --shadow-md, --radius (12px),
--radius-sm (8px), y una escala de espaciado coherente.
Si {{TEMA}}=oscuro: invertí superficies (fondo oscuro, paneles slate, texto claro)
manteniendo los mismos nombres de token y el contraste mínimo.

Tipografía: cargá Fira Sans (body) y Fira Code / Fira Sans para números y encabezados
con next/font/google en app/layout.tsx (NO @import en CSS). Body ≥ 16px, line-height 1.5–1.75,
line-length 65–75ch en bloques de texto. Usá Fira Code para los números grandes de las KPI
cards y los identificadores de cochera (.spot .name).
</sistema-de-diseno>

<robustez-ux>
Para que la interfaz no se vea pobre, aplicá el checklist de la skill ui-ux-pro-max:
- Reemplazá el emoji 🏢 del brand y cualquier estado por íconos SVG inline (estilo
  Lucide/Heroicons, viewBox 24x24, sin dependencias). Sin emojis como íconos.
- Estados completos en interactivos: :hover, :focus-visible (ring visible), :disabled,
  y filas de tabla con highlight al hover. cursor:pointer en todo lo clickable.
- Transiciones suaves 150–300ms en color/opacity/transform (no en width/height).
  Respetá @media (prefers-reduced-motion: reduce).
- Profundidad: sombras suaves (--shadow-sm/md), bordes y radios consistentes en cards,
  paneles y spots. Topbar y .container con max-width consistente.
- Estados vacío y de carga: empty state cuando no hay visitas/cocheras; spinner o estado
  "enviando…" deshabilitando el botón en operaciones async; reservá espacio para evitar
  saltos de contenido.
- Estado no solo por color: los badges ok/busy y los spots llevan ícono + texto, no solo
  el color (accesibilidad).
- Responsive verificado a 375 / 768 / 1024 / 1440px, sin scroll horizontal en mobile.
</robustez-ux>

<restricciones>
- No introduzcas Tailwind ni librerías de UI. Todo en app/globals.css con CSS variables/clases.
- No renombres las clases existentes ni rompas el markup que las páginas ya usan; podés
  agregar clases/elementos nuevos.
- No toques lógica de dominio, APIs ni lib/; los cambios son solo visuales y de markup.
- Mensajes y textos en español neutro; identificadores en inglés.
- Cumplí el Pre-Delivery Checklist de la skill: contraste 4.5:1, focus visible, alt/aria en
  íconos significativos, prefers-reduced-motion, labels asociados a inputs.
</restricciones>

<examples>
Imitá la estructura existente: app/parking/page.tsx (grilla server con .grid-spots/.spot),
app/page.tsx (KPI cards), app/porteria/VisitForm.tsx (form client con estados busy/error).
</examples>

<output>
- app/globals.css reescrito completo.
- Los diffs de markup de cada archivo tocado de {{ALCANCE}} (incluido app/layout.tsx con
  next/font), cada uno con su ruta como encabezado.
- Una nota breve de qué cambió y cómo verificarlo (npm run dev; npm test debe seguir verde).
</output>
```
