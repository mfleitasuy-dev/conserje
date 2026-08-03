# PLAN — Filtrar alertas por estado y severidad

> Plan final derivado de [`spec.v2.md`](./spec.v2.md), regenerado sin supuestos nuevos
> (G1–G4 cerrados). Cada criterio queda mapeado a archivo, función y test.

## 1. Cambios por archivo

### `lib/schemas.ts` — schema `alertFilter` *(E1, S1, UN1, UN2)*

- Helper `vacioComoAusente`: preprocesa `""`/espacios como `undefined` (S1), así el default
  y el opcional aplican igual que si el parámetro no viniera.
- `estado`: `z.enum(["activa", "resuelta", "todas"])` con `.default("todas")` (E1/G1).
- `severidad`: `z.enum(["baja", "media", "alta"])` opcional.
- Un valor no-string (el array de `getAll` cuando el parámetro viene repetido) no pasa el
  enum → 400 (UN2/G2).

### `lib/alerts.ts` — `listAlerts(db, filter?)` *(U1, U2, E2–E4)*

- `listAlerts` acepta `AlertFilter` opcional (default `{ estado: "todas" }`, compatible con
  los llamadores existentes). `WHERE` por cláusulas: `resolved_at IS NULL` / `IS NOT NULL`
  según `estado` (E2), `severity = $n` si hay `severidad` (E3); combinadas con AND (E4).
  `ORDER BY created_at DESC` (U1). Solo igualdad e `IS NULL` — pg-mem lo soporta.
- `listActiveAlerts` pasa a delegar en `listAlerts(db, { estado: "activa" })` (U2/G3);
  su firma y semántica no cambian.

### `app/api/alerts/route.ts` — GET con query params

- Mismo patrón que `GET /api/visits`: `getAll` por parámetro; si hay más de un valor se pasa
  el array crudo para que falle la validación (UN2); valida con `alertFilter`, delega y mapea
  con `errorResponse` (400 con `{ "error": "datos inválidos", "detalles": [...] }`).

## 2. Tests (`tests/alerts.test.ts`)

Conteos **relativos** (el seed trae alertas).

| Criterio | Test |
| --- | --- |
| E1 / G1 | sin filtro ⇒ igual que `estado=todas` (incluye resueltas) |
| E2 | `estado=activa` excluye resueltas; `estado=resuelta` solo resueltas |
| E3 | `severidad=alta` solo esa severidad |
| E4 | `estado=activa&severidad=alta` combinan con AND |
| U1 | orden `created_at` DESC |
| U2 / G3 | `listActiveAlerts` ≡ `listAlerts(estado=activa)` |
| S1 / G4 | `""` y `"  "` se ignoran (schema) |
| UN1 | `estado=abierta`, `severidad=urgente` rechazados (schema) |
| UN2 / G2 | array (parámetro repetido) rechazado (schema) |

## 3. Fuera de scope (antipatrones de la spec)

Sin endpoint nuevo, sin cambio de shape, sin tocar POST/resolve, sin UI, sin paginación.
