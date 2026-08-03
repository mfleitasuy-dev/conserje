# SPEC — Filtrar alertas por estado y severidad (v1)

> Spec ejecutable (SDD) del proyecto **Conserje**. Versión inicial, previa a la lectura
> crítica del plan; la refinada, con los gaps cerrados, está en [`spec.v2.md`](./spec.v2.md).
> Los gaps detectados al correr el plan están en [`gaps.md`](./gaps.md).

---

## 1. Problema y objetivo

**Problema.** El listado de alertas devuelve siempre todas (`GET /api/alerts` →
`listAlerts`): activas y resueltas mezcladas, de todas las severidades. Cuando hay historial
acumulado, encontrar las alertas altas sin resolver exige recorrer la lista a ojo.

**Objetivo.** Permitir consultar las alertas **filtrando por estado** (activa / resuelta) y/o
**por severidad** (baja / media / alta), sin cambiar cómo se crean ni cómo se resuelven.

Sin decisiones técnicas: el "cómo" va en la sección Stack / en el PLAN.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall devolver las alertas ordenadas por `created_at`,
  de la más reciente a la más antigua.
- **E1 (event-driven).** WHEN el request incluye `estado=activa`, el sistema devuelve solo
  las alertas **sin resolver**; WHEN incluye `estado=resuelta`, solo las **resueltas**.
- **E2 (event-driven).** WHEN el request incluye `severidad`, el sistema devuelve solo las
  alertas de **esa severidad**.
- **E3 (event-driven).** WHEN el request incluye `estado` **y** `severidad`, el sistema aplica
  **ambos** filtros de forma conjunta (AND).
- **UN1 (unwanted, IF…THEN).** IF `estado` o `severidad` traen un valor fuera de sus
  enumeraciones, THEN el sistema responde **400** de validación y no ejecuta la consulta.

Cada criterio es verificable con un request y una respuesta concretas. "Que sea fácil de
mirar" no es un criterio: es un deseo.

## 3. Ejemplos de entrada y salida

Shape de cada alerta (no cambia):

```json
{
  "id": 7,
  "message": "Humo en el subsuelo",
  "severity": "alta",
  "created_at": "2026-08-01T21:10:00.000Z",
  "resolved_at": null
}
```

**Happy path — activas:**

```
GET /api/alerts?estado=activa
→ 200
[ { "id": 7, "resolved_at": null, ... }, { "id": 5, "resolved_at": null, ... } ]
```

**Combinado — activas y altas:**

```
GET /api/alerts?estado=activa&severidad=alta
→ 200
[ { "id": 7, "severity": "alta", "resolved_at": null, ... } ]
```

**Error — valor fuera del enum:**

```
GET /api/alerts?estado=abierta
→ 400 (validación)
```

## 4. Edge cases y errores

- **Sin parámetros** → 200 con el listado como hasta ahora.
- **Filtro sin coincidencias** → 200 `[]` (no es error).
- **`estado` o `severidad` inválidos** → 400 de validación.

## 5. Antipatrones (qué NO hacer)

- **No** crear un endpoint nuevo: extender el `GET /api/alerts` existente.
- **No** cambiar el shape de la respuesta (sigue siendo un array de `Alert`).
- **No** tocar el `POST` de creación ni el `POST /api/alerts/[id]/resolve`.
- **No** agregar rango de fechas, búsqueda por texto en `message`, paginación ni
  ordenamiento configurable → **fuera de scope**.
- **No** modificar la UI de `/alertas` en esta spec (los filtros de pantalla son otra
  feature) → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- Extender `lib/alerts.ts` parametrizando el listado, reutilizando `ALERT_SELECT`.
- Nuevo schema Zod `alertFilter` en `lib/schemas.ts` con las dos enumeraciones.
- El route handler `app/api/alerts/route.ts` parsea `req.nextUrl.searchParams`, valida con
  `alertFilter`, delega en `lib/` y mapea errores con `errorResponse` (`ZodError` → 400).
- Tests con **Vitest + pg-mem** en `tests/alerts.test.ts` (ojo: el seed ya trae alertas —
  usar conteos relativos, como los tests existentes).
- Mensajes/comentarios en español neutro; identificadores en inglés.
