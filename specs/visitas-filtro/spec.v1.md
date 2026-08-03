# SPEC — Filtrar visitas por día y por unidad (v1)

> Spec ejecutable (SDD). Feature del proyecto **Conserje**. Esta es la **versión inicial**;
> la refinada, con los gaps cerrados, está en [`spec.v2.md`](./spec.v2.md).
> Los gaps detectados al correr el plan están en [`gaps.md`](./gaps.md).

---

## 1. Problema y objetivo

**Problema.** Hoy la portería solo puede ver las visitas **del día de hoy**
(`GET /api/visits` → `listVisitsToday`). Cuando el portero necesita revisar quién ingresó
un día anterior, o todas las visitas de una unidad puntual, no tiene cómo hacerlo desde la app.

**Objetivo.** Permitir consultar el historial de visitas **filtrando por día** y/o **por unidad**,
sin cambiar la forma en que se registran ni cómo se ven las visitas.

*(Sin decisiones técnicas: el "cómo" —librerías, SQL, archivos— va en la sección Stack / en el PLAN.)*

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall devolver las visitas ordenadas por `entered_at`,
  de la más reciente a la más antigua.
- **E1 (event-driven).** WHEN el request **no** incluye `fecha`, el sistema devuelve las visitas
  **del día de hoy** (comportamiento actual preservado).
- **E2 (event-driven).** WHEN el request incluye `fecha` con formato `YYYY-MM-DD` válido,
  el sistema devuelve únicamente las visitas cuyo `entered_at` corresponde a **ese día**.
- **E3 (event-driven).** WHEN el request incluye `unidad` con el *label* de una unidad,
  el sistema devuelve únicamente las visitas **de esa unidad**.
- **E4 (event-driven).** WHEN el request incluye `fecha` **y** `unidad`, el sistema aplica
  **ambos** filtros de forma conjunta (AND).
- **UN1 (unwanted, IF…THEN).** IF `fecha` no cumple el formato `YYYY-MM-DD`, THEN el sistema
  responde **400** `{ "error": "validation" }` y no ejecuta la consulta.

Cada criterio es **verificable** (se puede escribir un test). "Historial", "cómodo" o "rápido"
no son criterios: son deseos.

## 3. Ejemplos de entrada y salida

Cada visita tiene el shape actual de `Visit` (no cambia):

```json
{
  "id": 12,
  "visitor_name": "Ana Pérez",
  "visitor_doc": "4.123.456-7",
  "unit_label": "3A",
  "plate": "SBA 1234",
  "spot_label": "V2",
  "entered_at": "2026-07-09T14:05:00.000Z",
  "exited_at": null
}
```

**Happy path — por día:**

```
GET /api/visits?fecha=2026-07-09
→ 200
[ { "id": 12, "unit_label": "3A", "entered_at": "2026-07-09T14:05:00.000Z", ... },
  { "id": 11, "unit_label": "1B", "entered_at": "2026-07-09T09:20:00.000Z", ... } ]
```

**Combinado — día + unidad:**

```
GET /api/visits?fecha=2026-07-09&unidad=3A
→ 200
[ { "id": 12, "unit_label": "3A", "entered_at": "2026-07-09T14:05:00.000Z", ... } ]
```

**Error — fecha inválida:**

```
GET /api/visits?fecha=ayer
→ 400
{ "error": "validation" }
```

## 4. Edge cases y errores

- **Sin parámetros** (`GET /api/visits`) → 200 con las visitas de hoy (igual que hoy).
- **Fecha futura** (`?fecha=2099-01-01`) → 200 con lista vacía `[]` (no es error).
- **Día sin visitas** → 200 `[]`.
- **Fecha mal formada** (`?fecha=2026-13-40`, `?fecha=09/07/2026`) → 400 validation.

## 5. Antipatrones (qué NO hacer)

- **No** crear un endpoint nuevo: extender el `GET /api/visits` existente.
- **No** cambiar el shape de la respuesta (sigue siendo un array de `Visit`).
- **No** tocar el `POST` de registro ni el marcado de salida.
- **No** agregar rango de fechas (desde/hasta), paginación, búsqueda por texto,
  filtro por patente/estado (dentro/salió) ni export CSV → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- Extender `lib/visits.ts` con una función de filtrado que reciba `DB` y el filtro,
  reutilizando `VISIT_SELECT` y `unitIdByLabel`.
- Nuevo schema Zod `visitFilter` en `lib/schemas.ts` para validar los query params.
- El route handler `app/api/visits/route.ts` parsea los query params, delega en `lib/`
  y mapea errores con `errorResponse` (`ZodError` → 400).
- Tests con **Vitest + pg-mem** en `tests/visits.test.ts`.
- Mensajes/comentarios en español neutro; identificadores en inglés (convención del repo).
