# Evidencia — Resolver denuncias

> Ejecución de [`spec.v2.md`](./spec.v2.md) según [`plan.md`](./plan.md), el 2026-08-03.

## Qué se implementó

| Archivo | Cambio |
| --- | --- |
| `db/schema.sql` | Columna `resolved_at TIMESTAMPTZ` en `complaints` + `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para bases ya creadas (verificado que pg-mem lo acepta) |
| `lib/complaints.ts` | `resolved_at` en el tipo y el SELECT; `resolveComplaint(db, id)` con UPDATE condicional y `DomainError` `not_found`/`conflict` (calca de `resolveAlert`) |
| `app/api/complaints/[id]/resolve/route.ts` | POST nuevo; `id` no entero ⇒ 400 antes de tocar la base |
| `app/denuncias/ResolveButton.tsx` | Botón client con toast y `router.refresh()` (calca del de alertas) |
| `app/denuncias/page.tsx` | Columna Estado: badge `ok` "Resuelta + fecha" / badge `busy` "Abierta"; botón solo en abiertas |
| `tests/complaints.test.ts` | +5 tests: U1, E1, E2/S1, UN1, UN2 |

## Resultado de la suite

```
Test Files  5 passed (5)
     Tests  77 passed (77)   ← 72 previos + 5 nuevos
  Duration  503ms
```

`npm run build` → ✓ Compiled successfully (la ruta nueva compila).

## Commit

La feature completa entra en el commit `Feature: resolver denuncias (spec
resolver-denuncias v2)`, posterior al commit de la spec.
