# Specs — desarrollo guiado por especificaciones (SDD)

Cada feature vive en su carpeta con el ciclo completo, de la especificación a la evidencia
de ejecución:

```
specs/<feature>/
  spec.v1.md    # spec ejecutable inicial (criterios EARS, ejemplos, antipatrones)
  gaps.md       # lo que el plan generado desde v1 asumió y decidimos nosotros
  spec.v2.md    # spec refinada: cada gap cerrado como criterio EARS explícito
  plan.md       # plan final derivado de v2 (criterios → archivos/funciones/tests)
  evidencia.md  # qué se implementó, salida de la suite de tests y commits
```

El ciclo: se escribe `spec.v1.md` → se genera un plan con IA → se lee el plan de forma
**crítica** buscando supuestos que no decidimos (eso es `gaps.md`) → cada decisión vuelve a la
spec como criterio EARS (`spec.v2.md`) → se regenera el plan hasta que no aparecen supuestos
nuevos (`plan.md`) → se implementa con tests y se registra la **evidencia** (`evidencia.md`).

| Feature | Estado |
| --- | --- |
| [`visitas-filtro`](./visitas-filtro/spec.v2.md) | Ejecutada |
| [`alertas-filtro`](./alertas-filtro/spec.v2.md) | Ejecutada |
| [`resolver-denuncias`](./resolver-denuncias/spec.v2.md) | Ejecutada |
| [`dashboard-resumen`](./dashboard-resumen/spec.v2.md) | Ejecutada |
| [`redisenio-visual`](./redisenio-visual/spec.v2.md) | Pendiente (plan listo para ejecutar en sesión limpia) |
