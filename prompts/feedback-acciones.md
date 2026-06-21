# Plantilla: feedback-acciones

**Cuándo usarlo:** cuando querés feedback consistente de éxito/error después de cada acción del
panel (registrar visita, marcar salida, crear/resolver alerta, asignar cochera, publicar
noticia, registrar denuncia), con notificaciones tipo **toast** no bloqueantes en lugar del
feedback mínimo actual (error inline + reset silencioso).

**Variables:**

- `{{ALCANCE}}` — qué acciones/componentes cubrir. Default: los 7 client components
  (`app/porteria/VisitForm.tsx`, `app/porteria/ExitButton.tsx`, `app/alertas/AlertForm.tsx`,
  `app/alertas/ResolveButton.tsx`, `app/parking/AssignForm.tsx`, `app/noticias/NewsForm.tsx`,
  `app/denuncias/ComplaintForm.tsx`).
- `{{DURACION}}` — ms de auto-dismiss del toast. Default: `4000`.

**Ejemplo real:** los forms client que hoy postean a `/api/*` y solo hacen
`form.reset()` + `router.refresh()` en éxito (ej. `app/porteria/VisitForm.tsx`).

---

```xml
<rol>
Sos un desarrollador frontend senior de React/Next.js con buen ojo para feedback de UI
no intrusivo y accesible. Trabajás en CSS puro, sin librerías de UI.
</rol>

<contexto>
Conserje es un panel de portería + cocheras (Next.js 15 App Router, TypeScript). NO usa
Tailwind ni librerías de UI: todo el estilo vive en app/globals.css con clases y CSS
variables propias, y las fuentes Fira se cargan con next/font en app/layout.tsx.

Feedback actual (a reemplazar): los componentes client manejan useState busy/error,
postean con fetch contra /api/*, y ante !res.ok muestran un <p className="error"> inline;
en éxito hacen form.reset() + router.refresh() SIN confirmación visual. El usuario no
percibe que la acción salió bien.

Componentes client que ejecutan acciones (patrón fetch/busy/error idéntico):
app/porteria/VisitForm.tsx, app/porteria/ExitButton.tsx, app/alertas/AlertForm.tsx,
app/alertas/ResolveButton.tsx, app/parking/AssignForm.tsx, app/noticias/NewsForm.tsx,
app/denuncias/ComplaintForm.tsx.

Tokens existentes en :root de app/globals.css que DEBÉS reutilizar (no inventes paleta):
--ok #15803d / --ok-bg / --ok-border (éxito), --busy #b91c1c / --busy-bg / --busy-border
(error), --brand, --panel, --text, --muted, --line, --shadow-md, --radius, --radius-sm.
Las páginas son server components con dynamic = "force-dynamic".
</contexto>

<tarea>
Creá un sistema de notificaciones toast reutilizable y cableá {{ALCANCE}}:
1. Un componente client (ej. app/ui/Toast.tsx) que exponga un ToastProvider (React context),
   un hook useToast() que devuelva notify({ type, title, description? }), y un viewport que
   renderice/apile los toasts. type: "ok" | "error".
2. Montá el ToastProvider UNA sola vez en app/layout.tsx, envolviendo {children} (junto a la
   topbar existente), para que cualquier client component pueda usar useToast().
3. En cada componente de {{ALCANCE}}: en éxito llamá notify({ type:"ok", ... }) con un mensaje
   contextual (ej. "Visita registrada", "Salida marcada", "Alerta creada", "Alerta resuelta",
   "Cochera asignada", "Noticia publicada", "Denuncia registrada"), conservando router.refresh().
   En error llamá notify({ type:"error", title, description }) usando el mensaje del backend
   (j.error). Mantené el estado busy y el botón deshabilitado durante el fetch.
</tarea>

<sistema-de-diseno>
- Posición: viewport fijo en la esquina superior derecha (debajo de la topbar), apila los
  toasts verticalmente con gap consistente. z-index por encima de la topbar.
- Cada toast: superficie --panel, --radius, --shadow-md, borde acorde a la variante; ícono SVG
  inline (estilo Lucide/Heroicons, viewBox 24x24: check para .ok, triángulo de alerta para
  .error), título en negrita, descripción opcional en --muted, y botón de cierre (×).
- Variantes .ok (familia --ok/--ok-bg/--ok-border) y .error (familia --busy/--busy-bg/
  --busy-border). El estado se distingue por ícono + texto, NO solo por color.
- Auto-dismiss a los {{DURACION}} ms; pausa el temporizador al hover/focus; cierre manual con
  el botón ×. Permití varios toasts simultáneos.
- Animación de entrada/salida 150–250ms (transform/opacity, slide desde la derecha); respetá
  @media (prefers-reduced-motion: reduce).
- CSS nuevo en app/globals.css: .toast-viewport, .toast, .toast.ok, .toast.error, .toast .title,
  .toast .desc, .toast .close, más el keyframe de entrada.
</sistema-de-diseno>

<robustez-ux>
- Accesibilidad: el viewport o cada toast con role="status" y aria-live="polite" para "ok" y
  aria-live="assertive" para "error"; el botón de cierre con aria-label.
- Cierre con teclado (botón × enfocable; opcional Esc cierra el último).
- No rompas el layout ni las clases existentes; el toast se superpone, no desplaza contenido.
- Reservá el comportamiento actual: si una acción ya mostraba error inline podés quitarlo en
  favor del toast, pero NO dejes la acción sin feedback.
</robustez-ux>

<restricciones>
- No introduzcas Tailwind ni librerías de UI/toast (nada de sonner, react-hot-toast, radix).
  Todo con React + un componente client + CSS en app/globals.css.
- Reutilizá los tokens y clases existentes; no rehagas el sistema de estilos ni renombres clases.
- No toques lib/, las APIs ni la lógica de dominio: el cambio es solo de UI/markup cliente.
- Mensajes y textos en español neutro; identificadores en inglés. Tipá las props y el contexto.
- No agregues confirmación previa a las acciones: el toast es feedback de RESULTADO únicamente.
</restricciones>

<examples>
Imitá: app/porteria/VisitForm.tsx (patrón fetch/busy/error en client), y el uso de next/font
y la estructura de app/layout.tsx para montar el provider sin romper la topbar.
</examples>

<output>
- El componente nuevo (ej. app/ui/Toast.tsx) con su ruta como encabezado.
- Los diffs de markup de app/layout.tsx (provider montado) y de cada componente de {{ALCANCE}},
  cada uno con su ruta como encabezado.
- El CSS agregado a app/globals.css (clases .toast*).
- Una nota breve de qué cambió y cómo verificarlo (npm run dev: ejecutar una acción de cada
  módulo y ver el toast de éxito/error; npm test debe seguir verde porque no cambia lib/).
</output>
```
