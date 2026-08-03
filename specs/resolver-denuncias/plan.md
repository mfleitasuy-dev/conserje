# PLAN — Resolver denuncias

> Plan final derivado de [`spec.v2.md`](./spec.v2.md), regenerado sin supuestos nuevos
> (G1–G4 cerrados). Cada criterio queda mapeado a archivo, función y test.

## 1. Cambios por archivo

### `db/schema.sql` *(U1)*

- `resolved_at TIMESTAMPTZ` en `complaints` (nullable: nulo = abierta).
- **Nota de despliegue**: `CREATE TABLE IF NOT EXISTS` no agrega columnas a una base ya
  creada — en la DB local hay que correr
  `ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;`
  (pg-mem no lo necesita: los tests aplican el schema completo).

### `lib/complaints.ts` *(U1, U2, E1, E2, S1, UN1, UN2)*

- `resolved_at: string | null` en el tipo `Complaint` y en `COMPLAINT_SELECT` (E2: el
  listado no cambia de contrato, solo suma el campo).
- `resolveComplaint(db, id)`: calca de `resolveAlert` — `UPDATE ... SET resolved_at = now()
  WHERE id = $1 AND resolved_at IS NULL RETURNING id`; si no afectó filas, diagnostica:
  inexistente → `DomainError not_found` (UN1), ya resuelta → `conflict` (UN2). Solo
  timestamp, sin actor (U2).

### `app/api/complaints/[id]/resolve/route.ts` — nuevo *(E1, UN3)*

- Calca de `app/api/alerts/[id]/resolve/route.ts`: `Number(id)` + `Number.isInteger` →
  `DomainError invalid` (400) antes de tocar la base (UN3); delega en `resolveComplaint`;
  `errorResponse` mapea 400/404/409.

### UI `/denuncias` *(E2)*

- `app/denuncias/ResolveButton.tsx` (nuevo, client): calca del de alertas — POST al
  resolve, toast ok/error, `router.refresh()`; textos "Resolver" / "Denuncia resuelta".
- `app/denuncias/page.tsx`: columna **Estado** con badge `ok` "Resuelta + fecha" o badge
  `busy` "Abierta", y el botón Resolver solo en las abiertas (mismo layout que `/alertas`).

## 2. Tests (`tests/complaints.test.ts`)

| Criterio | Test |
| --- | --- |
| U1 | denuncia recién creada tiene `resolved_at` nulo |
| E1 | resolver fija `resolved_at` y devuelve la denuncia |
| E2 / S1 | el listado incluye la resuelta, con su `resolved_at` |
| UN1 | id inexistente ⇒ `not_found` |
| UN2 | segunda resolución ⇒ `conflict` |

(UN3 vive en el route handler: misma validación ya probada en el resolve de alertas.)

## 3. Fuera de scope (antipatrones de la spec)

Sin reabrir, sin filtro por estado (otra spec), sin responsable, sin notificaciones.
