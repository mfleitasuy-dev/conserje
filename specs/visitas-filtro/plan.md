# PLAN — Filtrar visitas por día y por unidad

> Plan final derivado de [`spec.v2.md`](./spec.v2.md). Regenerado sobre v2 sin supuestos
> nuevos (los G1–G5 ya están cerrados como criterios EARS). Cada criterio queda mapeado a
> archivo, función y test.

## 1. Cambios por archivo

### `lib/schemas.ts` — schema `visitFilter` *(UN1, UN2, S1)*

- `fecha`: `z.string()` opcional con regex `^\d{4}-\d{2}-\d{2}$` **más** validación de fecha
  real (round-trip por `new Date(y, m-1, d)`: rechaza `2026-13-40`). Un valor no-string
  (p. ej. el array que arma el route cuando `fecha` viene repetida) falla `z.string()` → 400.
- `unidad`: `z.string().trim()` opcional, transformada a `undefined` si queda vacía (S1).

### `lib/visits.ts` — `listVisits(db, filter)` *(U1, U2, E1–E4, UN3)*

- Helper `dayRange(fecha?)`: bordes del día en **hora local del servidor** calculados en JS
  (U2) — `[inicio_del_día, inicio_del_día_siguiente)` — y pasados como **parámetros** `Date`
  (pg-mem no soporta bien funciones de fecha en SQL; mismo patrón que `listVisitsToday`).
- SQL: `VISIT_SELECT` + `WHERE v.entered_at >= $1 AND v.entered_at < $2` (rango semi-abierto,
  E2) `[+ AND u.label = $3]` si hay `unidad` (E3; inexistente ⇒ `[]`, sin `DomainError` — UN3),
  `ORDER BY v.entered_at DESC` (U1). Sin `fecha` ⇒ hoy (E1); ambos filtros ⇒ AND (E4).
- `listVisitsToday(db)` pasa a delegar en `listVisits(db, {})` (no se duplica el SQL).

### `app/api/visits/route.ts` — GET con query params

- Lee `req.nextUrl.searchParams`; para `fecha` usa `getAll`: si llega repetida pasa el array
  crudo al schema para que falle la validación (UN2). Valida con `visitFilter`, delega en
  `listVisits`, mapea errores con `errorResponse`.
- **Nota sobre el cuerpo del 400**: los ejemplos de la spec escriben `{"error":"validation"}`
  como atajo; el contrato real es el de la sección *Stack* de la spec — el 400 lo arma
  `errorResponse` con la convención del repo: `{ "error": "datos inválidos", "detalles": [...] }`.

## 2. Tests (`tests/visits.test.ts`)

| Criterio | Test |
| --- | --- |
| E1 | sin filtros ⇒ solo las visitas de hoy |
| E2 + borde medianoche | por `fecha`: entra `23:59:59` del día, no entra `00:00:00` del siguiente (con `UPDATE entered_at` controlado) |
| E3 / UN3 | por `unidad`; unidad inexistente ⇒ `200 []` |
| E4 | `fecha` + `unidad` combinan con AND |
| U1 | orden `entered_at` DESC |
| S1 | `unidad: "  "` se ignora |
| UN1 | `visitFilter` rechaza `"ayer"`, `"09/07/2026"` y `"2026-13-40"` |
| UN2 | `visitFilter` rechaza `fecha` no-string (array de la query repetida) |
| Edge | fecha futura ⇒ `[]`; `listVisitsToday` sigue funcionando (delegación) |

## 3. Fuera de scope (antipatrones de la spec)

Sin endpoint nuevo, sin cambio de shape, sin rango desde/hasta, sin paginación, sin 404 por
unidad inexistente.
