# SPEC — Resolver denuncias (v2, refinado)

> Versión **refinada** de [`spec.v1.md`](./spec.v1.md): incorpora como criterios EARS
> explícitos las decisiones que en v1 quedaban implícitas
> (ver [`gaps.md`](./gaps.md), gaps G1–G4).

---

## 1. Problema y objetivo

**Problema.** Las denuncias solo se registran y se listan; no se distingue lo pendiente de
lo ya atendido.

**Objetivo.** Permitir **marcar una denuncia como resuelta**, dejando registrado cuándo,
con el estado visible en el listado — sin cambiar cómo se registran ni ocultar historial.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall registrar el momento de resolución (`resolved_at`);
  una denuncia recién creada está **abierta** (`resolved_at` nulo).
- **U2 (ubicuo).** The system shall registrar **solo el timestamp** de resolución: sin
  autenticación no hay actor que atribuir (ADR-002). *(G4)*
- **E1 (event-driven).** WHEN se resuelve una denuncia abierta, el sistema fija
  `resolved_at` y devuelve la denuncia actualizada.
- **E2 (event-driven).** WHEN se lista, el sistema devuelve **todas** las denuncias
  (abiertas y resueltas) con su estado visible; el contrato del `GET` no cambia. *(G1)*
- **S1 (state-driven).** WHERE una denuncia está resuelta, permanece en el historial con
  su `resolved_at` (resolver no borra). *(G2)*
- **UN1 (unwanted, IF…THEN).** IF la denuncia no existe, THEN el sistema responde **404**.
- **UN2 (unwanted, IF…THEN).** IF la denuncia ya está resuelta, THEN el sistema responde
  **409** y `resolved_at` no cambia (resolver es terminal: no hay "reabrir"). *(G2)*
- **UN3 (unwanted, IF…THEN).** IF el `id` de la URL no es un entero, THEN el sistema
  responde **400** sin consultar la base. *(G3)*

## 3. Ejemplos de entrada y salida

Shape de cada denuncia (suma `resolved_at`):

```json
{
  "id": 3,
  "unit_label": "2B",
  "category": "ruidos",
  "description": "Música fuerte pasada la medianoche",
  "created_at": "2026-08-01T03:20:00.000Z",
  "resolved_at": null
}
```

**Happy path:**

```
POST /api/complaints/3/resolve
→ 200
{ "id": 3, ..., "resolved_at": "2026-08-03T14:00:00.000Z" }
```

**Error — ya resuelta (UN2):**

```
POST /api/complaints/3/resolve   (por segunda vez)
→ 409
{ "error": "la denuncia 3 ya está resuelta" }
```

**Error — id inválido (UN3):**

```
POST /api/complaints/abc/resolve
→ 400
{ "error": "id de denuncia inválido" }
```

## 4. Edge cases y errores

- **Denuncia inexistente** → 404 (UN1).
- **Ya resuelta** → 409, `resolved_at` no cambia (UN2).
- **`id` no numérico** → 400 sin tocar la base (UN3).
- **Listado** → sigue devolviendo todas, ahora con `resolved_at` (E2).

## 5. Antipatrones (qué NO hacer)

- **No** borrar la denuncia al resolverla (S1).
- **No** ocultar las resueltas del listado (E2); un filtro por estado es otra spec.
- **No** agregar endpoint de reabrir (UN2), comentarios de resolución, responsable (U2)
  ni notificaciones → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- Columna `resolved_at TIMESTAMPTZ` en `complaints` (`db/schema.sql`); para bases ya
  creadas: `ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ`.
- `lib/complaints.ts`: `resolved_at` en el tipo y el SELECT; `resolveComplaint(db, id)`
  calcando `resolveAlert` (UPDATE condicional; `DomainError` `not_found`/`conflict`).
- Route handler `app/api/complaints/[id]/resolve/route.ts` calcando el de alertas
  (incluida la validación de `id` entero → 400).
- UI `/denuncias`: columna Estado (badge Abierta/Resuelta con fecha) + botón Resolver
  (calca de `ResolveButton` de alertas).
- Tests con **Vitest + pg-mem** en `tests/complaints.test.ts`.
- Mensajes/comentarios en español neutro; identificadores en inglés.

---

### Changelog v1 → v2

Cerrados los gaps G1–G4 (ver [`gaps.md`](./gaps.md)): listado completo con estado (E2),
sin reabrir (UN2/S1), id no numérico → 400 (UN3), solo timestamp sin actor (U2). Al
regenerar el plan sobre v2, **no aparecen supuestos nuevos** → spec listo.
