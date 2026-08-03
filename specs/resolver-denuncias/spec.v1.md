# SPEC — Resolver denuncias (v1)

> Spec ejecutable (SDD) del proyecto **Conserje**. Versión inicial, previa a la lectura
> crítica del plan; la refinada, con los gaps cerrados, está en [`spec.v2.md`](./spec.v2.md).
> Los gaps detectados al correr el plan están en [`gaps.md`](./gaps.md).

---

## 1. Problema y objetivo

**Problema.** Las denuncias solo se registran y se listan (`POST`/`GET /api/complaints` →
`createComplaint`/`listComplaints`). No hay forma de marcar que un reclamo ya fue atendido:
la lista crece y no se distingue lo pendiente de lo resuelto.

**Objetivo.** Permitir **marcar una denuncia como resuelta**, dejando registrado cuándo,
y que el listado muestre en qué estado está cada una.

Sin decisiones técnicas: el "cómo" va en la sección Stack / en el PLAN.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall registrar el momento de resolución de cada denuncia
  (`resolved_at`); una denuncia recién creada está **abierta** (`resolved_at` nulo).
- **E1 (event-driven).** WHEN se resuelve una denuncia abierta, el sistema fija
  `resolved_at` y devuelve la denuncia actualizada.
- **UN1 (unwanted, IF…THEN).** IF la denuncia no existe, THEN el sistema responde **404**.
- **UN2 (unwanted, IF…THEN).** IF la denuncia ya está resuelta, THEN el sistema responde
  **409** y no cambia nada.

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

**Error — ya resuelta:**

```
POST /api/complaints/3/resolve   (por segunda vez)
→ 409
{ "error": "la denuncia 3 ya está resuelta" }
```

## 4. Edge cases y errores

- **Denuncia inexistente** → 404.
- **Denuncia ya resuelta** → 409, `resolved_at` no cambia.

## 5. Antipatrones (qué NO hacer)

- **No** borrar la denuncia al resolverla: queda en el historial con su fecha.
- **No** tocar el `POST` de registro ni el `GET` del listado más allá del campo nuevo.
- **No** agregar comentarios de resolución, asignación de responsable ni notificaciones
  → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- Columna `resolved_at TIMESTAMPTZ` en `complaints` (`db/schema.sql`).
- `lib/complaints.ts`: `resolveComplaint(db, id)` con `DomainError`
  (`not_found`/`conflict`), calcando el patrón probado de `resolveAlert`.
- Route handler nuevo `app/api/complaints/[id]/resolve/route.ts` (calca del de alertas).
- UI en `/denuncias`: columna de estado y botón Resolver (calca de `/alertas`).
- Tests con **Vitest + pg-mem** en `tests/complaints.test.ts`.
- Mensajes/comentarios en español neutro; identificadores en inglés.
