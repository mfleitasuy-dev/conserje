# Gaps del spec — Resumen de denuncias y última noticia en el dashboard

> Registro de lo que el plan generado desde [`spec.v1.md`](./spec.v1.md) **asumió** sin que
> la spec lo dijera, detectado leyendo el plan de forma crítica. No son errores: son huecos
> que queremos decidir nosotros. Cada gap se traslada como criterio EARS a
> [`spec.v2.md`](./spec.v2.md).

| # | Gap (lo que el plan asumió) | Decisión (v2) |
|---|---|---|
| G1 | **¿Qué número va en la tarjeta de denuncias?** El plan mostraba el total histórico ("es el dato más completo"). | **Las abiertas**: es el número accionable para portería. El resumen expone `{ total, abiertas }` igual, para quien necesite ambos (E1). |
| G2 | **¿La última noticia como conteo o como texto?** El plan ponía "Noticias publicadas: N". | **El título + la fecha**: un conteo de noticias viejas no le dice nada al portero; el título sí. Si no hay noticias, la tarjeta muestra `—` sin romper (E2, S1). |
| G3 | **¿Consultas SQL nuevas con COUNT/FILTER?** El plan escribía agregaciones SQL dedicadas. | **Reusar el listado de dominio y contar en JS**, patrón ya establecido por `parkingSummary` (y a prueba de pg-mem). Con el volumen de un edificio alcanza; un COUNT dedicado sería otra decisión cuando duela (U1). |
| G4 | **¿Panel con el cuerpo de la noticia?** El plan agregaba un panel completo con el body. | **Solo tarjeta.** El detalle vive en `/noticias`; el dashboard resume (antipatrón: no duplicar pantallas). |

## Notas de la lectura del plan

- Sumar las consultas al `Promise.all` existente de la página — OK, no es gap.
- Tests con conteos relativos por el seed — OK, ya era regla de la casa.
- Tras cerrar G1–G4 y regenerar el plan sobre v2, no aparecen supuestos nuevos → spec listo.
