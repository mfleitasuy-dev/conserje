# Evidencia — Filtrar visitas por día y por unidad

> Ejecución de [`spec.v2.md`](./spec.v2.md) según [`plan.md`](./plan.md), el 2026-08-03.

## Qué se implementó

| Archivo | Cambio |
| --- | --- |
| `lib/schemas.ts` | `visitFilter` (+ helper `esFechaReal`): `fecha` opcional `YYYY-MM-DD` validada como fecha real; `unidad` opcional con trim, vacía ⇒ ausente |
| `lib/visits.ts` | `listVisits(db, filter)` con helper `dayRange` (bordes del día en JS, rango semi-abierto como parámetros); `listVisitsToday` ahora delega en `listVisits(db, {})` |
| `app/api/visits/route.ts` | `GET` lee `searchParams`, detecta `fecha` repetida vía `getAll` (el array falla la validación ⇒ 400), valida con `visitFilter` y delega |
| `tests/visits.test.ts` | +12 tests: `listVisits` (E1–E4, U1, UN3, borde de medianoche, fecha futura) y `visitFilter` (S1, UN1, UN2) |

Cobertura criterio → test detallada en la tabla de [`plan.md`](./plan.md).

## Resultado de la suite

```
Test Files  5 passed (5)
     Tests  62 passed (62)   ← 50 previos + 12 nuevos
  Duration  490ms
```

`npm run build` → ✓ Compiled successfully (sin errores de tipos).

## Verificación manual (curl, app en dev)

Registrada en la corrida de verificación final — ver `docs/browser-agent/` para la
evidencia E2E general del proyecto.

## Commit

La feature completa (schema + dominio + route + tests + este documento) entra en el commit
`Feature: filtrar visitas por fecha y unidad (spec visitas-filtro v2)`.
