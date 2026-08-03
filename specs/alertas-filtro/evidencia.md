# Evidencia — Filtrar alertas por estado y severidad

> Ejecución de [`spec.v2.md`](./spec.v2.md) según [`plan.md`](./plan.md), el 2026-08-03.

## Qué se implementó

| Archivo | Cambio |
| --- | --- |
| `lib/schemas.ts` | `alertFilter` (+ helper `vacioComoAusente`): `estado` enum con default `todas`, `severidad` enum opcional; vacío ⇒ ausente; array (repetido) falla la validación |
| `lib/alerts.ts` | `listAlerts(db, filter?)` con `WHERE` por cláusulas (`resolved_at IS NULL`/`IS NOT NULL`, `severity = $n`); `listActiveAlerts` ahora delega en `listAlerts(db, { estado: "activa" })` |
| `app/api/alerts/route.ts` | `GET` lee `searchParams` con `getAll` (repetido ⇒ 400), valida con `alertFilter` y delega |
| `tests/alerts.test.ts` | +10 tests: `listAlerts` (E1–E4, U1, U2) y `alertFilter` (S1, UN1, UN2) |

Cobertura criterio → test detallada en la tabla de [`plan.md`](./plan.md).

## Resultado de la suite

```
Test Files  5 passed (5)
     Tests  72 passed (72)   ← 62 previos + 10 nuevos
  Duration  502ms
```

## Commit

La feature completa (schema + dominio + route + tests + este documento) entra en el commit
`Feature: filtrar alertas por estado y severidad (spec alertas-filtro v2)`, posterior al
commit de la spec (`Spec: alertas-filtro v1 → gaps → v2`).
