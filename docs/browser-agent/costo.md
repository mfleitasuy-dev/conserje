# Costo — Browser agent sobre el flujo de portería

> Mini documento de costo de la corrida documentada en [`corrida.md`](./corrida.md)
> (2026-08-03). Los tokens son estimaciones a partir del tamaño de los snapshots y
> respuestas de las tools en la sesión del agente.

## Números

| Métrica | Valor |
| --- | --- |
| Tiempo de la corrida (navegación → captura final) | **~74 s** (01:23:35 → 01:24:49) |
| Llamadas a tools de Playwright | **11** (2 navigate, 3 snapshot, 1 fill_form, 2 click, 2 wait_for, 3 screenshot, 1 close) |
| Tokens estimados | **~12.000** (≈ 9.500 de entrada — los snapshots de accesibilidad son lo más caro, ~1.500–2.500 c/u en páginas con tablas — y ≈ 2.500 de salida) |
| Costo aproximado | centavos de dólar por corrida (con cualquier modelo frontier de 2026); el driver del costo es el tamaño del snapshot, no la cantidad de pasos |

## Fallas y reintentos

1. **Timeout del toast (PASO 4).** `wait_for "Visita registrada"` venció a los 5 s: el toast
   se auto-cierra antes de que el agente llegue a esperar (el round-trip click → wait de un
   agente es más lento que un usuario). **Resolución**: verificar contra la **fila de la
   tabla** (estado persistente) en vez del toast (estado efímero). Lección para futuros
   flujos: asertar sobre datos, no sobre notificaciones.
2. Sin otros reintentos: selects por label accesible (`Unidad`, `Cochera de visita`) y
   textos exactos de la UI funcionaron a la primera.

## Notas de iteración

- El nombre único (`Test <timestamp>`) evitó colisiones con datos persistentes — necesario
  porque la base no se resetea entre corridas.
- Pre-calentar las páginas con `curl` antes de la corrida evitó pagar el compile on-demand
  de Next dev dentro de los timeouts del navegador.
