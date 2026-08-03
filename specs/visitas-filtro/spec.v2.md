# SPEC — Filtrar visitas por día y por unidad (v2, refinado)

> Versión **refinada** de [`spec.v1.md`](./spec.v1.md): incorpora como
> criterios EARS explícitos las decisiones que en v1 quedaban implícitas
> (ver [`gaps.md`](./gaps.md), gaps G1–G5).

---

## 1. Problema y objetivo

**Problema.** La portería solo puede ver las visitas del día de hoy
(`GET /api/visits` → `listVisitsToday`). No hay forma de revisar quién ingresó un día anterior,
ni de ver todas las visitas de una unidad puntual.

**Objetivo.** Permitir consultar el historial de visitas **filtrando por día** y/o **por unidad**,
sin cambiar cómo se registran ni el shape con el que se ven las visitas.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall devolver las visitas ordenadas por `entered_at`,
  de la más reciente a la más antigua.
- **U2 (ubicuo).** The system shall interpretar el "día" de `fecha` en la **zona horaria del
  servidor** (consistente con `listVisitsToday`). *(G2)*
- **E1 (event-driven).** WHEN el request **no** incluye `fecha`, el sistema devuelve las visitas
  del **día de hoy**.
- **E2 (event-driven).** WHEN el request incluye `fecha` = `YYYY-MM-DD` válida, el sistema
  devuelve las visitas con `entered_at` **>= inicio del día** (`00:00`) **y < inicio del día
  siguiente** (rango semi-abierto). *(G3)*
- **E3 (event-driven).** WHEN el request incluye `unidad` con el *label* de una unidad,
  el sistema devuelve únicamente las visitas **de esa unidad**.
- **E4 (event-driven).** WHEN el request incluye `fecha` **y** `unidad`, el sistema aplica
  **ambos** filtros de forma conjunta (AND).
- **S1 (state-driven / optional).** WHERE `unidad` viene vacío o solo con espacios,
  el sistema lo **ignora** (equivale a no enviar `unidad`). *(G4)*
- **UN1 (unwanted, IF…THEN).** IF `fecha` no cumple el formato `YYYY-MM-DD`, THEN el sistema
  responde **400** `{ "error": "validation" }` y no ejecuta la consulta.
- **UN2 (unwanted, IF…THEN).** IF `fecha` llega **repetida** en la query
  (`?fecha=…&fecha=…`), THEN el sistema responde **400** `{ "error": "validation" }`. *(G5)*
- **UN3 (unwanted, IF…THEN).** IF `unidad` no corresponde a ninguna unidad existente,
  THEN el sistema responde **200** con lista vacía `[]` (un filtro sin coincidencias **no** es
  error de recurso). *(G1)*

## 3. Ejemplos de entrada y salida

Shape de cada visita (no cambia):

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
[ { "id": 12, "unit_label": "3A", ... }, { "id": 11, "unit_label": "1B", ... } ]
```

**Combinado — día + unidad:**

```
GET /api/visits?fecha=2026-07-09&unidad=3A
→ 200
[ { "id": 12, "unit_label": "3A", ... } ]
```

**Unidad inexistente (G1):**

```
GET /api/visits?unidad=ZZ
→ 200
[]
```

**Error — fecha inválida:**

```
GET /api/visits?fecha=ayer
→ 400
{ "error": "validation" }
```

**Error — fecha repetida (G5):**

```
GET /api/visits?fecha=2026-07-01&fecha=2026-07-02
→ 400
{ "error": "validation" }
```

## 4. Edge cases y errores

- **Sin parámetros** → 200 con las visitas de hoy.
- **Fecha futura** → 200 `[]` (no es error).
- **Día sin visitas** → 200 `[]`.
- **Fecha mal formada** (`2026-13-40`, `09/07/2026`) → 400 validation.
- **Unidad inexistente** → 200 `[]` (G1).
- **`unidad=` vacío o con espacios** → se ignora; se devuelve como si no hubiera filtro de unidad (G4).
- **`fecha` repetida** → 400 validation (G5).
- **Borde de medianoche** — una visita registrada `23:59:59` del día `fecha` **entra**;
  una de `00:00:00` del día siguiente **no** (rango semi-abierto, G3).

## 5. Antipatrones (qué NO hacer)

- **No** crear un endpoint nuevo: extender el `GET /api/visits` existente.
- **No** cambiar el shape de la respuesta (sigue siendo un array de `Visit`).
- **No** tocar el `POST` de registro ni el marcado de salida.
- **No** agregar rango de fechas (desde/hasta), paginación, búsqueda por texto,
  filtro por patente/estado ni export CSV → **fuera de scope**.
- **No** responder 404 cuando la unidad no existe (es un filtro, no una búsqueda de recurso).

---

## Stack / decisiones ya tomadas (puente al PLAN)

- Extender `lib/visits.ts` con `listVisits(db, filtro)` (o parametrizar `listVisitsToday`),
  reutilizando `VISIT_SELECT`. El "día" se calcula con hora local (como `listVisitsToday`) y se
  filtra con rango semi-abierto `[inicio_día, inicio_día_siguiente)`.
- Nuevo schema Zod `visitFilter` en `lib/schemas.ts`:
  - `fecha`: opcional, string `YYYY-MM-DD` (regex + validez de fecha); rechaza valores repetidos.
  - `unidad`: opcional, `trim`, el vacío se trata como ausente.
- El route handler `app/api/visits/route.ts` parsea `req.nextUrl.searchParams`, valida con
  `visitFilter`, delega en `lib/` y mapea errores con `errorResponse` (`ZodError` → 400).
  Para `unidad` inexistente, `lib/` devuelve `[]` (no lanza `DomainError`).
- Tests con **Vitest + pg-mem** en `tests/visits.test.ts` cubriendo U1–UN3 y los edge cases.
- Mensajes/comentarios en español neutro; identificadores en inglés.

---

### Changelog v1 → v2

Cerrados los gaps G1–G5 (ver `gaps.md`): zona horaria del día (U2), rango
semi-abierto (E2), `unidad` vacía ignorada (S1), `fecha` repetida → 400 (UN2), unidad inexistente
→ 200 `[]` (UN3). Al regenerar el plan sobre v2, **no aparecen supuestos nuevos** → spec listo.
