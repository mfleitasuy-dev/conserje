# Gaps del spec — Rediseño visual en tema oscuro

> Registro de lo que un plan generado desde [`spec.v1.md`](./spec.v1.md) **asumiría** sin que
> la spec lo dijera, detectado leyendo el plan de forma crítica. No son errores: son huecos
> que queremos decidir nosotros. Cada gap se traslada como criterio EARS a
> [`spec.v2.md`](./spec.v2.md).

| # | Gap (lo que el plan asumió) | Decisión (v2) |
|---|---|---|
| G1 | **¿Qué fuentes?** El generador `--design-system` de `ui-ux-pro-max` sugirió Playfair Display + Source Serif 4 (serif editorial). No corresponde a la referencia, que usa una sans geométrica con numerales mono. | **Mantener Fira Sans (texto) y Fira Code (numerales)**, que ya se cargan con `next/font/google`. Solo se agrega el peso **300** de Fira Code para los numerales grandes. Cero dependencias nuevas (U2). |
| G2 | **¿Paleta exacta?** El plan elegía "un gris oscuro" y "un verde" a ojo, y el generador proponía slate/rojo (#020617 / #EF4444). | **Tokens fijos, leídos del shot:** `--bg #121412`, `--panel #171A18`, `--panel-2 #1D211E` (hover de fila / input), `--line rgba(255,255,255,.08)`, `--text #ECEFEA`, `--heading #F5F7F3`, `--muted #9AA39B`, `--accent #DCE5D9` (salvia), `--on-accent #121412`, `--brand` y `--brand-dark` como alias de `--accent` (no romper usos), `--ok #9FD6A8` / `--ok-bg rgba(159,214,168,.12)` / `--ok-border rgba(159,214,168,.35)`, `--busy #F2A5A0` / `--busy-bg rgba(242,165,160,.12)` / `--busy-border rgba(242,165,160,.35)`, severidad: baja = familia `ok`, media = ámbar `#E8C98A`, alta = familia `busy`. `--ring 0 0 0 3px rgba(220,229,217,.35)`. Cada par texto/fondo se verifica ≥ 4.5:1 (U1, UN2). |
| G3 | **¿De dónde sale la hora/fecha del encabezado?** Las páginas son server components con `force-dynamic`; el plan la renderizaba en el servidor (queda congelada y además depende del TZ del server). | **Componente client `app/ui/Clock.tsx`**, montado una sola vez en `app/layout.tsx` dentro de la fila de encabezado. Muestra `HH:mm` y fecha larga en `es-UY` con helpers puros de `lib/format.ts`, se actualiza cada minuto y renderiza `—` hasta montar (sin mismatch de hidratación) (E1, UN3). |
| G4 | **¿Cuántas cards de acento y cuáles?** El plan pintaba de salvia "las KPI importantes" sin definir cuáles. | **Exactamente una por pantalla**, la métrica accionable para el portero: dashboard → *Visitas en el edificio*; cocheras → *Cocheras libres*; alertas → *Alertas activas*; denuncias → *Denuncias abiertas*; portería y noticias → ninguna (no tienen KPI) (U3). |
| G5 | **¿Grilla de cocheras?** El plan rellenaba cada spot con verde/rojo sólido, compitiendo con la card de acento. | **Spots como mini-cards bordeadas**: libre = borde y texto familia `ok` + `CheckCircleIcon`; ocupado = familia `busy` + `CarIcon`; el identificador en Fira Code. Solo la card de acento usa relleno sólido (E3). |
| G6 | **¿Tema claro o toggle?** El plan dejaba "preparado" un tema claro duplicando tokens. | **No.** Un único tema oscuro y `color-scheme: dark` en `:root` para que los controles nativos acompañen (U5). |
| G7 | **¿Cómo se prueba un cambio solo visual?** CLAUDE.md pide un test por cambio de comportamiento; el plan no decía nada. | No hay cambio de dominio → **no se agregan tests de Vitest para CSS**. El único código nuevo testeable son los helpers `horaCorta` / `fechaLarga` de `lib/format.ts` → `tests/format.test.ts`. La evidencia visual es: `npm test` verde, `npm run build` OK, reporte del subagente `ui-reviewer` en las 6 rutas a 375 y 1440 px, y tabla de contrastes por token (UN1, UN2). |
| G8 | **¿Nav en mobile?** El plan agregaba un menú hamburguesa con estado en JS (como el botón "Menu" del shot). | **Nav en fila horizontal con scroll** bajo 600 px, sin JS: es un kiosko, menos piezas móviles (E4). |

## Notas de la lectura del plan

- Conservar los nombres de clase y tocar solo `className` en los client components — OK, ya
  era regla de la spec.
- No tocar `lib/` salvo helpers puros de formato — OK, coherente con el puente al PLAN.
- Usar `ui-ux-pro-max` para el checklist y `design-taste-frontend` para el pre-flight, y
  `ui-reviewer` para el QA — OK, es el método, no un gap.
- Tras cerrar G1–G8 y regenerar el plan sobre v2, no aparecen supuestos nuevos → spec listo.
