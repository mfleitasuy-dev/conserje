# Plantilla: tests-vitest

**Cuándo usarlo:** cuando agregaste o cambiaste lógica de dominio en `lib/` y necesitás tests que la
cubran (caso feliz + reglas de negocio + errores), siguiendo el patrón pg-mem del proyecto.

**Variables:**

- `{{MODULO}}` — módulo a testear (ej. `parking`).
- `{{FUNCIONES}}` — funciones a cubrir (ej. `listSpots, assignResidentSpot`).
- `{{REGLAS}}` — reglas/errores que deben verificarse (ej. "rechaza unidad inexistente").

**Ejemplo real:** se usó para `tests/visits.test.ts` (alta, cochera ocupada, salida que libera, etc.).

---

```xml
<rol>
Sos un desarrollador senior que practica TDD y escribe tests claros, deterministas y rápidos.
</rol>

<contexto>
Los tests de Conserje corren con Vitest y NO usan una DB real: usan el helper makeTestDb()
(tests/helpers/db.ts), que crea una base pg-mem cargando db/schema.sql + db/seed.sql. El seed tiene
8 unidades (1A..4B) y 6 cocheras (R-01..R-03 residente, V-01..V-03 visita). Las funciones de dominio
reciben un DB. Se importa con alias @/lib/...
</contexto>

<tarea>
Escribí tests/{{MODULO}}.test.ts para {{FUNCIONES}}, cubriendo el caso feliz y estas reglas: {{REGLAS}}.
</tarea>

<restricciones>
- Usá beforeEach para reinstanciar makeTestDb() en cada test (aislamiento).
- Para errores esperados usá `await expect(fn()).rejects.toThrow(/regex/i)`.
- No mockees la DB a mano: usá pg-mem vía makeTestDb().
- Apoyate en los datos del seed; no insertes unidades/cocheras nuevas salvo que el test lo requiera.
</restricciones>

<examples>
Imitá: tests/visits.test.ts y tests/parking.test.ts.
</examples>

<output>
Solo el contenido de tests/{{MODULO}}.test.ts.
</output>
```
