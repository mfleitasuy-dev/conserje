# Evidencia — Resumen de denuncias y última noticia en el dashboard

> Ejecución de [`spec.v2.md`](./spec.v2.md) según [`plan.md`](./plan.md), el 2026-08-03.

## Qué se implementó

| Archivo | Cambio |
| --- | --- |
| `lib/complaints.ts` | `complaintsSummary(db)` → `{ total, abiertas }` contando en JS sobre `listComplaints` (patrón `parkingSummary`) |
| `lib/news.ts` | `latestNews(db)` → primer elemento de `listNews` o `null` |
| `app/page.tsx` | Tarjetas 6 y 7: "Denuncias abiertas" (`FlagIcon`) y "Última noticia" con título + fecha o `—` (`NewspaperIcon`) |
| `app/globals.css` | Variante `.card .num.txt` (texto con elipsis para tarjetas no numéricas) |
| `tests/complaints.test.ts` | +1 test: total/abiertas relativos, resolver baja solo abiertas (E1, UN1) |
| `tests/news.test.ts` | +2 tests: la recién creada es la última (E2); sin noticias ⇒ `null` (S1) |

## Resultado de la suite

```
Test Files  5 passed (5)
     Tests  80 passed (80)   ← 77 previos + 3 nuevos
  Duration  490ms
```

`npm run build` → ✓ Compiled successfully.

## Commit

La feature completa entra en el commit `Feature: resumen de denuncias y última noticia en
el dashboard`, posterior al commit de la spec.
