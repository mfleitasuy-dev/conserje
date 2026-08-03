# Gaps del spec — Filtrar alertas por estado y severidad

> Registro de lo que el plan generado desde [`spec.v1.md`](./spec.v1.md) **asumió** sin que
> la spec lo dijera, detectado leyendo el plan de forma crítica. No son errores: son huecos
> que queremos decidir nosotros. Cada gap se traslada como criterio EARS a
> [`spec.v2.md`](./spec.v2.md).

| # | Gap (lo que el plan asumió) | Decisión (v2) |
|---|---|---|
| G1 | **Default de `estado`.** El plan proponía que sin `estado` se devolvieran solo las activas ("es lo que uno quiere ver"). La spec v1 solo decía que sin parámetros "se lista como hasta ahora", sin fijarlo como criterio. | **`todas`.** El `GET /api/alerts` actual devuelve todo el historial y la página `/alertas` depende de eso; cambiar el default rompería el contrato. Queda como criterio explícito (E1 de v2). |
| G2 | **Parámetro repetido.** El plan tomaba "el último valor gana" (`searchParams.get`). En `visitas-filtro` ya decidimos lo contrario (G5 de aquella spec). | **400 de validación**, consistente con `visitas-filtro`: una query ambigua no se adivina (UN2). |
| G3 | **¿Qué pasa con `listActiveAlerts`?** El plan la eliminaba y reescribía el dashboard para llamar al listado filtrado. | **Queda**, delegando en el listado parametrizado. La usan `app/page.tsx` y ningún consumidor debería enterarse del refactor (criterio U2: firmas públicas estables). |
| G4 | **Valor vacío (`?severidad=`).** El plan lo trataba como inválido → 400. En `visitas-filtro` el vacío se ignora (S1 de aquella spec). | **Se ignora** (equivale a no enviar el parámetro), consistente con el resto de la API (S1). |

## Notas de la lectura del plan

- El plan reutilizaba `ALERT_SELECT` y armaba el `WHERE` con parámetros posicionales —
  OK, no es gap.
- Proponía tests con conteos relativos por el seed — OK, no es gap (ya era regla de la casa).
- Tras cerrar G1–G4 y regenerar el plan sobre v2, no aparecen supuestos nuevos → spec listo.
