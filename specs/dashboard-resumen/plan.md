# PLAN — Resumen de denuncias y última noticia en el dashboard

> Plan final derivado de [`spec.v2.md`](./spec.v2.md), regenerado sin supuestos nuevos
> (G1–G4 cerrados).

## 1. Cambios por archivo

### `lib/complaints.ts` — `complaintsSummary(db)` *(U1, E1, UN1)*

- Reusa `listComplaints` y cuenta en JS (patrón `parkingSummary`):
  `{ total: list.length, abiertas: list.filter(c => !c.resolved_at).length }`.

### `lib/news.ts` — `latestNews(db)` *(E2, S1)*

- Reusa `listNews` (ya ordena `created_at DESC`): devuelve el primer elemento o `null`.

### `app/page.tsx` *(E1, E2, S1)*

- Suma `complaintsSummary(db)` y `latestNews(db)` al `Promise.all`.
- Tarjeta 6: `FlagIcon`, `num` = abiertas, `lbl` "Denuncias abiertas".
- Tarjeta 7: `NewspaperIcon`, título de la noticia (o `—`) con la variante `num txt`,
  `lbl` "Última noticia · fecha" (solo "Última noticia" si no hay).

### `app/globals.css`

- Variante `.card .num.txt`: tamaño de texto (no cifra monoespaciada), una línea con
  elipsis — para tarjetas cuyo valor es un título.

## 2. Tests

| Criterio | Test |
| --- | --- |
| E1 / UN1 | `tests/complaints.test.ts`: crear denuncia sube `total` y `abiertas`; resolverla baja solo `abiertas` (conteos relativos al seed) |
| E2 | `tests/news.test.ts`: la recién creada es la `latestNews` |
| S1 | `tests/news.test.ts`: sin noticias (DELETE) ⇒ `null` |

## 3. Fuera de scope (antipatrones de la spec)

Sin panel de detalle, sin gráficos, sin tocar los módulos de origen.
