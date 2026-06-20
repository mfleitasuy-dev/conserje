# Plantilla: componente-ui

**Cuándo usarlo:** cuando necesitás una página o un componente client nuevo para la UI (una tabla,
un formulario que postea a la API, una grilla de estado) consistente con el look & feel actual.

**Variables:**

- `{{COMPONENTE}}` — qué es (ej. "formulario para registrar un paquete").
- `{{TIPO}}` — `server` (lee datos) o `client` (interactivo, con estado/fetch).
- `{{DATOS}}` — qué datos muestra o envía y a qué endpoint.
- `{{CLASES}}` — clases CSS de globals.css a reutilizar (ej. `panel`, `stack`, `table`, `badge`).

**Ejemplo real:** se usó para `app/porteria/VisitForm.tsx` (client, postea a `/api/visits`).

---

```xml
<rol>
Sos un desarrollador frontend senior de React/Next.js con buen ojo para UIs limpias y accesibles.
</rol>

<contexto>
Conserje NO usa Tailwind: el estilo está en app/globals.css con clases utilitarias propias
(panel, cards, card, table, badge ok|busy, stack, spot, ghost, error). Las páginas son server
components con `dynamic = "force-dynamic"` que leen vía lib/. Los componentes interactivos son
client ("use client"), usan fetch contra /api/* y luego router.refresh() para refrescar datos.
</contexto>

<tarea>
Creá un componente {{TIPO}} para "{{COMPONENTE}}" que maneje {{DATOS}}, reutilizando {{CLASES}}.
</tarea>

<restricciones>
- Reutilizá las clases existentes de globals.css; no inventes un sistema de estilos nuevo.
- Si es client: manejá estados busy y error, y refrescá con router.refresh() tras una mutación OK.
- Tipá las props. Mensajes en español.
- No traigas librerías de UI externas.
</restricciones>

<examples>
Imitá: app/porteria/VisitForm.tsx (form client), app/parking/page.tsx (grilla server).
</examples>

<output>
Solo el/los archivo(s) del componente, con su ruta como encabezado.
</output>
```
