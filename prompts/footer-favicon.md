# Plantilla: footer-favicon

**Cuándo usarlo:** cuando querés cerrar el layout de Conserje con un **footer institucional**
(marca + copyright + links de navegación) y un **favicon propio**, reutilizando el motivo de
`BuildingIcon`, **sin** tocar la arquitectura, las APIs ni la lógica de dominio. Edita
`app/layout.tsx`, agrega CSS en `app/globals.css` y crea `app/icon.svg`.

**Variables:**

- `{{COPYRIGHT}}` — texto de copyright del footer. Default: `© 2026 Conserje`.
- `{{TAGLINE}}` — bajada de marca en el footer. Default:
  `Gestión de accesos y cocheras para edificios`.

**Ejemplo de uso:** "Agregá footer y favicon" → `{{COPYRIGHT}}=© 2026 Conserje`,
`{{TAGLINE}}=Gestión de accesos y cocheras para edificios`.

**Sistema de diseño de referencia:** mismo del rediseño base (skill `ui-ux-pro-max`), estilo
*Data-Dense Dashboard*, paleta azul seguridad + verde, tipografía Fira.

---

```xml
<rol>
Sos un desarrollador frontend senior de React/Next.js con buen ojo para layouts limpios,
accesibles y con jerarquía visual fuerte. Trabajás en CSS puro, sin librerías de UI.
</rol>

<contexto>
Conserje es un panel de portería + cocheras (Next.js 15 App Router, TypeScript). NO usa
Tailwind ni librerías de UI: todo el estilo vive en app/globals.css con clases y CSS
variables propias, y las fuentes Fira se cargan con next/font en app/layout.tsx.

Layout actual en app/layout.tsx (estructura a respetar):
<html className={fira variables}> → <body> → <ToastProvider> → <header className="topbar">
(usa BuildingIcon + <nav> con <Link> a /, /porteria, /parking, /noticias, /alertas,
/denuncias) → <main className="container">{children}</main>. Hay un objeto `metadata`
(title/description) exportado. Las páginas son server components con dynamic = "force-dynamic".

Hoy NO existe footer (ni <footer> ni clase .footer en app/globals.css) ni favicon (no hay
app/icon*, app/favicon.ico ni nada en public/): el navegador muestra el ícono por defecto.

Íconos SVG inline en app/icons.tsx (viewBox 24x24, fill=none, stroke=currentColor,
strokeWidth 2, decorativos con aria-hidden). BuildingIcon es el motivo de marca y la fuente
del favicon.

Tokens de :root a reutilizar (NO inventes paleta): --brand #0369a1, --brand-dark #075985,
--topbar #0c2a45, --bg #eff6ff, --panel #ffffff, --text #0c4a6e, --muted #475569,
--line #e2e8f0, --radius, --radius-sm, --shadow-sm, --shadow-md. La topbar usa
linear-gradient(180deg, #0e3358, var(--topbar)).
</contexto>

<tarea>
Agregá dos cosas, sin romper clases ni markup existentes:

1. FOOTER en app/layout.tsx: un <footer className="footer"> montado DENTRO de <ToastProvider>
   y DESPUÉS de <main>. Debe contener:
   (a) bloque de marca: BuildingIcon + "Conserje" + {{TAGLINE}} + {{COPYRIGHT}}.
   (b) navegación que repita los mismos accesos que la topbar (Dashboard /, Portería /porteria,
       Cocheras /parking, Noticias /noticias, Alertas /alertas, Denuncias /denuncias)
       reutilizando next/link.
   El footer debe quedar pegado al fondo en páginas cortas (sticky footer), SIN position:fixed.
   Para eso ajustá body a display:flex; flex-direction:column; min-height:100vh y dale
   flex:1 a main.container.

2. FAVICON: creá app/icon.svg (metadata icon file-based del App Router; con ese archivo el
   App Router cablea el <link> solo, no hace falta tocar `metadata` salvo que quieras declarar
   `icons` explícitamente). Reutilizá el trazo de BuildingIcon sobre un fondo sólido
   (familia --topbar/--brand) con el edificio en trazo claro, cuadrado y legible a 16/32px.
</tarea>

<sistema-de-diseno>
- Footer: superficie sobria con borde superior 1px var(--line), fondo var(--panel) (o un
  teñido muy leve), texto en var(--muted); separación clara del contenido principal con
  padding generoso. Layout en columnas (marca a la izquierda, nav a la derecha o en columnas)
  que colapsa a una sola columna en mobile. Ancho alineado al .container de la app.
- Marca del footer: ícono a la izquierda del nombre; {{TAGLINE}} en --muted y {{COPYRIGHT}}
  en una línea sutil. Los links con :hover y :focus-visible coherentes con la topbar
  (subrayado o color --brand al hover, ring visible en focus).
- CSS nuevo en app/globals.css: .footer, marca del footer (.footer .brand o clase propia),
  .footer nav, .footer a (+ :hover/:focus-visible), más el ajuste de body (flex column,
  min-height:100vh) y main.container { flex:1 } para el sticky footer.
- Favicon (app/icon.svg): SVG cuadrado (viewBox 0 0 32 32 o 24 24), fondo redondeado en
  color de marca, edificio en trazo/relleno claro, sin texto, con buen contraste a 16px.
</sistema-de-diseno>

<robustez-ux>
- Sticky footer real: no se superpone al contenido ni usa position:fixed; en páginas largas
  queda al final natural, en páginas cortas se ancla al fondo del viewport.
- El <nav> del footer con aria-label propio (ej. "Pie de página") distinto al de la topbar;
  links enfocables con focus visible.
- BuildingIcon decorativo (aria-hidden) salvo que aporte significado.
- Respetá @media (prefers-reduced-motion: reduce); contraste ≥ 4.5:1 en texto y links;
  sin scroll horizontal a 375px.
</robustez-ux>

<restricciones>
- No introduzcas Tailwind ni librerías de UI. Todo el estilo en app/globals.css con CSS
  variables/clases. Para el favicon NO uses binarios: solo app/icon.svg.
- No renombres las clases existentes ni rompas el markup de topbar/main/ToastProvider; podés
  agregar clases/elementos nuevos.
- No toques lib/, las APIs ni la lógica de dominio: el cambio es solo de layout/markup/estilos.
- Mensajes y textos en español neutro; identificadores en inglés. Tipá lo que agregues.
</restricciones>

<examples>
Imitá app/layout.tsx (uso de next/font, BuildingIcon, Link y la estructura del ToastProvider)
y app/icons.tsx (estilo de los SVG inline) para mantener consistencia visual.
</examples>

<output>
- El diff de app/layout.tsx (footer agregado, body/main ajustados si corresponde) con su ruta
  como encabezado.
- El archivo nuevo app/icon.svg completo.
- El CSS agregado a app/globals.css (clases .footer* + ajuste de body/main.container).
- Una nota breve de qué cambió y cómo verificarlo: npm run dev (footer pegado al fondo en una
  página corta, links del footer navegan, favicon visible en la pestaña del navegador);
  npm test debe seguir verde porque no cambia lib/.
</output>
```
