# Gaps del spec — Resolver denuncias

> Registro de lo que el plan generado desde [`spec.v1.md`](./spec.v1.md) **asumió** sin que
> la spec lo dijera, detectado leyendo el plan de forma crítica. No son errores: son huecos
> que queremos decidir nosotros. Cada gap se traslada como criterio EARS a
> [`spec.v2.md`](./spec.v2.md).

| # | Gap (lo que el plan asumió) | Decisión (v2) |
|---|---|---|
| G1 | **¿El listado oculta las resueltas?** El plan filtraba `listComplaints` a solo abiertas "para que la bandeja quede limpia". | **Se muestran todas**, con estado visible (badge Abierta/Resuelta). El contrato del `GET` no cambia; un filtro por estado sería otra spec (como `alertas-filtro`). |
| G2 | **¿Se puede reabrir?** El plan agregaba un endpoint `reopen` simétrico "ya que estamos". | **No.** Reabrir es otra feature con sus propias reglas; resolver es terminal en este MVP (UN2: segunda resolución → 409). |
| G3 | **`id` no numérico** (`/api/complaints/abc/resolve`). El plan lo dejaba pasar a la query (error 500 de Postgres). | **400** `invalid` validando `Number.isInteger` antes de consultar, consistente con el resolve de alertas (UN3). |
| G4 | **¿Quién resolvió?** El plan agregaba una columna `resolved_by` con un valor fijo "portería". | **Solo el timestamp.** Sin autenticación no hay actor real que registrar (ver ADR-002); inventar uno sería mentir en los datos. |

## Notas de la lectura del plan

- Calcar `resolveAlert` (UPDATE condicional + diagnóstico `not_found`/`conflict`) — OK,
  no es gap: es el patrón de la casa.
- `CREATE TABLE IF NOT EXISTS` no agrega columnas a tablas existentes: el plan preveía el
  `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para la base local — OK, va como nota de
  despliegue en el plan final.
- Tras cerrar G1–G4 y regenerar el plan sobre v2, no aparecen supuestos nuevos → spec listo.
