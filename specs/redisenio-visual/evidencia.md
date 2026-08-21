# Evidencia — Rediseño visual en tema oscuro

> Ejecución de [`spec.v2.md`](./spec.v2.md) según [`plan.md`](./plan.md), el 2026-08-20, en la
> rama `redisenio-visual`. Skills usadas como pide el plan §0: `ui-ux-pro-max` (checklist y
> consultas `--domain ux|color|typography`; sin `--design-system`) y `design-taste-frontend`
> (Design Read + pre-flight anti-default). QA con los subagentes `test-runner`/`ui-reviewer` y
> una auditoría adversarial de la spec (3 lentes) antes de cerrar.

## Qué se implementó

| Archivo                                                                                                                                   | Cambio                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`                                                                                                                         | Reescritura completa: tokens de §3 en `:root` + `color-scheme: dark`; topbar plano con nav subrayada (`aria-current`) y scroll horizontal < 600 px (E4); `.page-head`/`.clock`; `.cards.bento` (12 col, acento `span 6`, resto `span 3`; 1024/600); cards, paneles y spots sin sombra (U3); `.card.accent` forzando `--on-accent`; badges `ok\|warn\|busy\|neutral` con ícono; inputs 44 px sobre `--panel-2`; botones pill y `ghost` con 4 estados (U4); `.mono` para horas de tablas (U2); toasts/footer oscuros; `prefers-reduced-motion` sin transiciones ni spinner (S2). Todas las clases anteriores conservadas por nombre |
| `app/layout.tsx`                                                                                                                          | Fira Code pesos 300–600; nav con `NavLink`; `<div class="page-head"><Clock/></div>` antes de `{children}` (E1); footer sobrio                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `app/ui/Clock.tsx` (nuevo)                                                                                                                | Client component: `—` hasta montar (UN3), `setInterval` de 60 s limpiado al desmontar, `aria-live="off"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `app/ui/NavLink.tsx` (nuevo)                                                                                                              | Client component mínimo: `aria-current="page"` en la ruta activa (el CSS la subraya)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `app/icons.tsx`                                                                                                                           | `ClockIcon` (mismo estilo base)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `lib/format.ts`                                                                                                                           | `horaCorta(d)` y `fechaLarga(d)` (puras, `es-UY`); `hora`/`fechaHora` intactas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `tests/format.test.ts` (nuevo)                                                                                                            | +3 tests (E1): `"11:37"`, medianoche `"00:05"`, `"9 de setiembre"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `app/page.tsx`                                                                                                                            | `cards bento`; "Visitas en el edificio" = `card accent`; badges de severidad con ícono; `td.mono` en horas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `app/parking/page.tsx`                                                                                                                    | KPI de acento "Cocheras libres" (`parkingSummary`); spot ocupada con `CarIcon` (E3)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `app/alertas/page.tsx`, `app/denuncias/page.tsx`                                                                                          | KPI de acento "Alertas activas" / "Denuncias abiertas" (`listActiveAlerts`, `complaintsSummary`); badges con ícono; `td.mono`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `app/porteria/page.tsx`, `app/noticias/page.tsx`                                                                                          | Solo `td.mono` en la columna de hora/fecha (ya tenían `.table-wrap`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 9 client components (`VisitForm`, `ExitButton`, `AssignForm`, `FreeButton`, `NewsForm`, `AlertForm`, `ComplaintForm`, 2× `ResolveButton`) | Solo `className`: `button` / `button ghost`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `prompts/redisenio-ui.md`                                                                                                                 | Nota inicial: el sistema vigente es el de esta spec (tema oscuro)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `specs/redisenio-visual/spec.v2.md`, `plan.md`                                                                                            | Ejemplo de `fechaLarga` → `"9 de setiembre"`; fila `--ring` con el valor corregido                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Desvíos respecto del plan (decididos en la ejecución)

- **`"setiembre"`, no `"septiembre"`:** con `es-UY`, `Intl` devuelve la grafía uruguaya (CLDR). Se
  mantuvo `es-UY` (coherente con `hora`/`fechaHora`) y se corrigió el ejemplo de la spec.
- **`hourCycle: "h23"`** en vez de `hour12: false`: mismo resultado en Node y evita el "24:05" de
  medianoche de algunos navegadores (el reloj corre en el cliente).
- **`.page-head` flotado a la derecha:** la spec E1 pide el `h1` a la izquierda y el reloj a la
  derecha en la misma fila; el plan dejaba el reloj en una fila propia. Se resolvió por CSS
  (`float: right`) sin mover el `h1` de las 6 páginas; < 600 px el reloj va sobre el título.
- **`--ring` .35 → .5:** con .35 el anillo de foco daba 2.8:1 sobre `--bg`/`--panel` (< 3:1 de
  WCAG 1.4.11) en nav, `button.ghost` y `.toast-close`; con .5 da 4.2–4.3:1. UN2 prevé corregir
  tokens por contraste.
- **Clase aditiva `.mono`** para que las horas de las tablas vayan en Fira Code (U2).
- **Badges de severidad/neutral/estado con ícono** (spec §4): baja = `CheckCircleIcon`, media =
  `DotIcon`, alta = `AlertTriangleIcon`; neutral = `DotIcon`; ok = `CheckCircleIcon`; busy =
  `AlertTriangleIcon`.
- **`NavLink`** (client, `usePathname`): pieza mínima para el "estado activo subrayado" de la nav.

## Resultado de la suite (UN1)

```
✓ tests/format.test.ts (3 tests) 1ms
✓ tests/news.test.ts (7 tests) 93ms
✓ tests/complaints.test.ts (12 tests) 110ms
✓ tests/parking.test.ts (14 tests) 118ms
✓ tests/alerts.test.ts (19 tests) 149ms
✓ tests/visits.test.ts (28 tests) 207ms
Test Files  6 passed (6)
Tests  83 passed (83)
Duration  490ms (transform 121ms, setup 0ms, collect 445ms, tests 678ms, environment 1ms, prepare 231ms)
```

## Build (UN1)

```
▲ Next.js 15.5.19
✓ Compiled successfully in 2.7s
✓ Generating static pages (4/4)
┌ ƒ /                                      147 B         103 kB
├ ○ /_not-found                            998 B         103 kB
├ ƒ /alertas                             2.04 kB         104 kB
├ ƒ /api/alerts                            147 B         103 kB
├ ƒ /api/alerts/[id]/resolve               147 B         103 kB
├ ƒ /api/complaints                        147 B         103 kB
├ ƒ /api/complaints/[id]/resolve           147 B         103 kB
├ ƒ /api/news                              147 B         103 kB
├ ƒ /api/parking                           147 B         103 kB
├ ƒ /api/units                             147 B         103 kB
├ ƒ /api/visits                            147 B         103 kB
├ ƒ /api/visits/[id]/exit                  147 B         103 kB
├ ƒ /denuncias                           2.11 kB         105 kB
├ ○ /icon.svg                                0 B            0 B
├ ƒ /noticias                            1.84 kB         104 kB
├ ƒ /parking                             2.02 kB         104 kB
└ ƒ /porteria                            2.23 kB         105 kB
```

`/api/visits` y `/api/parking` devuelven exactamente el mismo JSON que antes del cambio
(`diff` byte a byte de las respuestas capturadas antes y después: sin diferencias).

## SSR del reloj (UN3)

`curl` a las 6 rutas: HTTP 200 y 4 `—` en cada HTML (hora y fecha del reloj + valores vacíos);
`card accent` aparece 1 vez en `/`, `/parking`, `/alertas`, `/denuncias` y 0 en `/porteria`,
`/noticias` (U3). Sin warnings de hidratación en consola (ver QA más abajo).

## Tabla de contrastes (UN2)

Calculada con luminancia relativa WCAG sobre los tokens del `app/globals.css` final, componiendo
los `rgba` sobre su fondo real.

| Par (texto, AA ≥ 4.5:1)                                               | Colores               | Ratio   |     |
| --------------------------------------------------------------------- | --------------------- | ------- | --- |
| `--text` / `--bg` (body)                                              | #ECEFEA sobre #121412 | 15.96:1 | ✅  |
| `--text` / `--panel` (cards, tablas)                                  | #ECEFEA sobre #171A18 | 15.12:1 | ✅  |
| `--text` / `--panel-2` (inputs, fila hover, toast)                    | #ECEFEA sobre #1D211E | 14.05:1 | ✅  |
| `--heading` / `--bg` (h1, nav activa, hora del reloj)                 | #F5F7F3 sobre #121412 | 17.17:1 | ✅  |
| `--heading` / `--panel` (h2, `.num`, `.spot .name`)                   | #F5F7F3 sobre #171A18 | 16.27:1 | ✅  |
| `--muted` / `--bg` (nav, subtítulo, fecha del reloj, footer)          | #9AA39B sobre #121412 | 7.13:1  | ✅  |
| `--muted` / `--panel` (labels, `th`, `.lbl`, `.kind`, `.empty`)       | #9AA39B sobre #171A18 | 6.75:1  | ✅  |
| `--muted` / `--panel-2` (placeholder, toast `.desc`, `badge.neutral`) | #9AA39B sobre #1D211E | 6.28:1  | ✅  |
| `--on-accent` / `--accent` (card de acento, botón pill)               | #121412 sobre #DCE5D9 | 14.33:1 | ✅  |
| `--on-accent` 75 % / `--accent` (`.lbl` de la card de acento)         | #444844 sobre #DCE5D9 | 7.20:1  | ✅  |
| `--on-accent` / `--heading` (pill `:hover`)                           | #121412 sobre #F5F7F3 | 17.17:1 | ✅  |
| `--ok` / `--ok-bg`∘panel (badge libre, sev. baja)                     | #9FD6A8 sobre #273129 | 8.13:1  | ✅  |
| `--warn` / `--warn-bg`∘panel (badge sev. media)                       | #E8C98A sobre #302F26 | 8.43:1  | ✅  |
| `--busy` / `--busy-bg`∘panel (badge ocupada, sev. alta, `.error`)     | #F2A5A0 sobre #312B28 | 7.08:1  | ✅  |
| `--text` / `--panel` (botón ghost)                                    | #ECEFEA sobre #171A18 | 15.12:1 | ✅  |
| `--heading` / `--panel-2` (ghost `:hover`, toast `.title`)            | #F5F7F3 sobre #1D211E | 15.12:1 | ✅  |

| Par (no texto, WCAG 1.4.11 ≥ 3:1)                      | Colores               | Ratio   |     |
| ------------------------------------------------------ | --------------------- | ------- | --- |
| `--ring` compuesto / `--bg` (foco en nav)              | #777C76 sobre #121412 | 4.34:1  | ✅  |
| `--ring` compuesto / `--panel` (foco ghost en tablas)  | #7A8078 sobre #171A18 | 4.33:1  | ✅  |
| `--ring` compuesto / `--panel-2` (foco `.toast-close`) | #7C837C sobre #1D211E | 4.19:1  | ✅  |
| `--accent` / `--panel-2` (borde de input en foco)      | #DCE5D9 sobre #1D211E | 12.61:1 | ✅  |
| `--accent` / `--panel` (card de acento vs panel)       | #DCE5D9 sobre #171A18 | 13.57:1 | ✅  |

Tokens leídos de `app/globals.css` (`--ring` = `0 0 0 3px rgba(220, 229, 217, 0.5)`). Pares de texto: 16, fallan: 0.

Nota: los bordes `--line` (1.25:1 sobre `--panel`) y los bordes de estado de los spots
(`--ok-border`/`--busy-border`, ≈ 2.3:1) quedan por debajo del 3:1 de WCAG 1.4.11 para límites de
componente; son los valores que fija la spec (§3) y el estado no depende solo de ellos (ícono +
texto + foco con `--accent` 12.6:1). Queda anotado como mejora futura.

## QA visual (ui-reviewer, 375 y 1440 px)

Recorrido con Playwright sobre las 6 rutas (`/`, `/porteria`, `/parking`, `/noticias`, `/alertas`,
`/denuncias`): subagente `ui-reviewer` (viewport por defecto + flujo de portería: registrar visita
`QA <timestamp>` y marcar su salida) y dos pasadas adicionales a **375 × 800** y **1440 × 900**.

| Verificación                                                                            | 375 px                                  | 1440 px |
| --------------------------------------------------------------------------------------- | --------------------------------------- | ------- |
| Scroll horizontal de página (`scrollWidth` ≤ viewport)                                  | ✅ ninguna ruta                         | ✅      |
| Errores / warnings de consola (incl. hidratación)                                       | ✅ 0                                    | ✅ 0    |
| `.card.accent` por pantalla (1/0/1/0/1/1)                                               | ✅                                      | ✅      |
| Bento del dashboard: 7 cards, acento ≈ 2× de ancho, 2 filas                             | una columna ✅                          | ✅      |
| `.page-head`: `h1` a la izquierda y reloj a la derecha en la misma fila                 | reloj sobre el `h1` (decisión < 600 px) | ✅      |
| Reloj tras montar: `HH:mm` + "20 de agosto"                                             | ✅                                      | ✅      |
| Nav: `aria-current` en la ruta activa; < 600 px fila con `overflow-x: auto` desplazable | ✅ (`scrollLeft` > 0)                   | ✅      |
| Labels asociados en todos los formularios; botones e inputs ≥ 44 px                     | ✅                                      | ✅      |
| Spots: borde de estado + ícono + "Libre"/"Ocupada", sin relleno                         | ✅                                      | ✅      |
| Sin sombras en `.card/.panel/.spot`; `color-scheme: dark`; `.num` en Fira Code 300      | —                                       | ✅      |
| Foco visible (anillo) en links de nav y botón primario                                  | —                                       | ✅      |
| `prefers-reduced-motion: reduce` (emulado): spinner oculto, transiciones en `0s`        | —                                       | ✅      |
| Flujo portería: toast de éxito + tabla refrescada + badge "Salió HH:mm" + botón ghost   | —                                       | ✅      |

El `ui-reviewer` reportó un "toast de éxito que no se ve tras `router.refresh()`"; se **refutó**
reproduciendo el flujo con Playwright: el toast "Visita registrada" permanece de 0,25 s a 4,0 s
con la tabla ya refrescada. La observación se debió a que otro agente navegaba el mismo browser
compartido en ese momento.

Hallazgos menores del QA corregidos antes del commit (CSS): fechas/horas mono que se partían en
dos líneas (`.mono { white-space: nowrap }`), botones que se partían ("Marcar salida"), toast que
tapaba el reloj (viewport abajo a la derecha), `.toast-close` de 20 px (→ 28 px), `select` 2 px más
bajo que `input` (misma altura), tablas comprimidas a 375 px (`min-width: 640px` dentro del
scroll), falta de pista de scroll en la nav móvil (fundido con `mask-image`), anillo de foco
recortado por el `overflow` de la nav móvil, `scroll-padding-top` móvil, y borde de los
controles de formulario casi invisible (token nuevo `--line-input`, 3.1:1).

Quedan como **follow-up** (fuera del alcance visual de esta spec): `hora()`/`fechaHora()` en 24 h
como el reloj (hoy "11:48 p. m."), `h2` "Alertas" con el mismo nombre que el `h1`, el meta de
"Última noticia" en dos líneas en cards angostas, tablas como tarjetas por debajo de ~480 px, y
alinear el `setInterval` del reloj al cambio de minuto.

## Revisión final de la rama

Revisión de toda la rama (diff completo + archivos nuevos) contra la spec, el plan y el ledger de
decisiones: **APROBADO CON MINORS**, sin hallazgos Critical; los 14 criterios (U1–U5, E1–E4,
S1–S2, UN1–UN3) en CUMPLE. Los tres Important (artefactos `.playwright-mcp/` sin ignorar,
placeholders de esta evidencia, borde de inputs a 1.25:1) y los minors recomendados se
corrigieron en una única ola de fixes con re-revisión acotada antes del commit. Verificación
independiente del revisor: `tsc` limpio, 83/83 tests, Prettier limpio, ninguna clase de CSS
eliminada, sin colores fuera de `:root`, `lib/`/`app/api`/`db/`/`mcp/` intactos.

## Commit

La feature completa entra en el commit `Feature: rediseño visual en tema oscuro` de la rama
`redisenio-visual`, posterior al commit de la spec (`Spec: rediseño visual en tema oscuro (v1 →
gaps → v2 → plan)`). Tras la revisión final y el QA, una única ola de fixes (re-revisada 9/9)
quedó incluida en el mismo commit.
