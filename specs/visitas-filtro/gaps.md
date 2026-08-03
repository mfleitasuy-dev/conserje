# Gaps del spec — Filtrar visitas por día y por unidad

> Registro de **qué interpretó / asumió la IA** al generar el plan de implementación a partir de
> [`spec.v1.md`](./spec.v1.md), leyendo el plan de forma crítica.
> Cada gap es una **decisión que el plan tomó y que el spec v1 no fijaba**. No son errores: son
> huecos que queremos decidir **nosotros**. Cada gap se resuelve y se traslada como criterio EARS
> a [`spec.v2.md`](./spec.v2.md).

| # | Gap (lo que el plan asumió) | Decisión (v2) |
|---|---|---|
| G1 | **Unidad inexistente.** El plan podía tratar `?unidad=ZZ` como 404 `not_found` (consistente con `registerVisit`) **o** como lista vacía. | **200 `[]`.** Un filtro que no matchea devuelve vacío; no es un error de recurso. Se separa de `registerVisit`, donde la unidad SÍ debe existir. |
| G2 | **Zona horaria del "día".** El plan no sabía si "el día `fecha`" se interpreta en UTC o en hora local del servidor. `listVisitsToday` usa hora **local**. | **Hora local del servidor**, para ser consistente con `listVisitsToday`. Se documenta explícitamente. |
| G3 | **Límites del día.** El plan podía filtrar con `>= 00:00 AND <= 23:59:59`, lo que puede perder eventos en el último segundo. | **Rango semi-abierto** `entered_at >= inicio_del_día AND entered_at < inicio_del_día_siguiente`. |
| G4 | **`unidad` vacío.** El plan no definía qué hacer con `?unidad=` (string vacío) o solo espacios. | Se **ignora** (equivale a no enviar `unidad`): el schema hace `trim` y trata el vacío como ausente. |
| G5 | **`fecha` duplicada.** Con `?fecha=2026-07-01&fecha=2026-07-02`, el plan no definía cuál gana. | El schema acepta **un único** valor escalar; si llega repetido, **400 validation** (sin ambigüedad). |

## Notas de la lectura del plan

- El plan reutilizaba bien `VISIT_SELECT` y `unitIdByLabel` (no reinventó SQL) → OK, no es gap.
- El plan mantenía el shape `Visit[]` y el orden `entered_at DESC` → coincide con U1/antipatrones → OK.
- Tras cerrar G1–G5 en v2 y **regenerar el plan**, el plan ya no agrega supuestos nuevos:
  señal de que el spec quedó **listo**.
