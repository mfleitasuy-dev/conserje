# SPEC — Filtrar alertas por estado y severidad (v2, refinado)

> Versión **refinada** de [`spec.v1.md`](./spec.v1.md): incorpora como criterios EARS
> explícitos las decisiones que en v1 quedaban implícitas
> (ver [`gaps.md`](./gaps.md), gaps G1–G4).

---

## 1. Problema y objetivo

**Problema.** El listado de alertas devuelve siempre todas (`GET /api/alerts` →
`listAlerts`): activas y resueltas mezcladas, de todas las severidades.

**Objetivo.** Permitir consultar las alertas **filtrando por estado** y/o **por severidad**,
sin cambiar cómo se crean, cómo se resuelven, ni el shape con el que se ven.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall devolver las alertas ordenadas por `created_at`,
  de la más reciente a la más antigua.
- **U2 (ubicuo).** The system shall mantener estables las firmas públicas existentes:
  `listActiveAlerts` sigue existiendo y devuelve lo mismo que el listado filtrado por
  `estado=activa`. *(G3)*
- **E1 (event-driven).** WHEN el request **no** incluye `estado`, el sistema devuelve
  **todas** las alertas (default `todas`; el contrato actual no cambia). *(G1)*
- **E2 (event-driven).** WHEN el request incluye `estado=activa`, el sistema devuelve solo
  las alertas con `resolved_at` nulo; WHEN incluye `estado=resuelta`, solo las que tienen
  `resolved_at`.
- **E3 (event-driven).** WHEN el request incluye `severidad`, el sistema devuelve solo las
  alertas de esa severidad.
- **E4 (event-driven).** WHEN el request incluye `estado` **y** `severidad`, el sistema aplica
  **ambos** filtros de forma conjunta (AND).
- **S1 (state-driven / optional).** WHERE `estado` o `severidad` vienen vacíos o solo con
  espacios, el sistema los **ignora** (equivale a no enviarlos). *(G4)*
- **UN1 (unwanted, IF…THEN).** IF `estado` o `severidad` traen un valor fuera de sus
  enumeraciones (`activa|resuelta|todas`, `baja|media|alta`), THEN el sistema responde
  **400** de validación y no ejecuta la consulta.
- **UN2 (unwanted, IF…THEN).** IF `estado` o `severidad` llegan **repetidos** en la query,
  THEN el sistema responde **400** de validación. *(G2)*

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

**Vacío se ignora (G4):**

```
GET /api/alerts?estado=&severidad=alta
→ 200
[ ...todas las alertas de severidad alta, resueltas o no... ]
```

**Error — valor fuera del enum:**

```
GET /api/alerts?estado=abierta
→ 400 (validación)
```

**Error — parámetro repetido (G2):**

```
GET /api/alerts?estado=activa&estado=resuelta
→ 400 (validación)
```

## 4. Edge cases y errores

- **Sin parámetros** → 200 con todas las alertas (E1).
- **Filtro sin coincidencias** → 200 `[]` (no es error).
- **`estado=todas` explícito** → igual que sin `estado`.
- **`estado=` vacío o con espacios** → se ignora (S1).
- **Valor inválido o repetido** → 400 de validación (UN1, UN2).

## 5. Antipatrones (qué NO hacer)

- **No** crear un endpoint nuevo: extender el `GET /api/alerts` existente.
- **No** cambiar el shape de la respuesta (sigue siendo un array de `Alert`).
- **No** tocar el `POST` de creación ni el `POST /api/alerts/[id]/resolve`.
- **No** eliminar `listActiveAlerts` ni cambiar sus consumidores (U2).
- **No** agregar rango de fechas, búsqueda por texto, paginación ni ordenamiento
  configurable → **fuera de scope**.
- **No** modificar la UI de `/alertas` en esta spec → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- `lib/alerts.ts`: parametrizar `listAlerts(db, filtro)` reutilizando `ALERT_SELECT`, con
  `WHERE` armado por cláusulas y parámetros posicionales; `listActiveAlerts` delega en ella.
- Nuevo schema Zod `alertFilter` en `lib/schemas.ts`: `estado` con default `todas` y
  `severidad` opcional; el vacío se preprocesa como ausente; un valor no-string (parámetro
  repetido) falla la validación.
- `app/api/alerts/route.ts`: el GET parsea `req.nextUrl.searchParams` (con `getAll` para
  detectar repetidos), valida con `alertFilter` y mapea errores con `errorResponse`.
- Tests con **Vitest + pg-mem** en `tests/alerts.test.ts`, con conteos relativos (el seed
  trae alertas).
- Mensajes/comentarios en español neutro; identificadores en inglés.

---

### Changelog v1 → v2

Cerrados los gaps G1–G4 (ver [`gaps.md`](./gaps.md)): default `todas` (E1), parámetro
repetido → 400 (UN2), `listActiveAlerts` estable (U2), vacío ignorado (S1). Al regenerar el
plan sobre v2, **no aparecen supuestos nuevos** → spec listo.
