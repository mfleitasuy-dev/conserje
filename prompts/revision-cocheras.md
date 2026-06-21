# Plantilla: revision-cocheras

**Cuándo usarlo:** cuando un módulo no refleja bien su estado en la UI/datos y hay que
diagnosticar la causa y aplicar el arreglo respetando las convenciones del proyecto.
Pensado para el módulo de cocheras, pero la estructura sirve para cualquier "el estado
guardado no coincide con lo que se muestra".

**Variables:**

- `{{SINTOMA}}` — qué se observa mal (default: "las cocheras se asignan a una unidad pero
  siguen mostrándose como Libre").

**Ejemplo real:** se asigna una cochera de residente desde `app/parking` y queda en "Libre".
La causa está en `lib/parking.ts`: `listSpots` calcula `occupied` solo a partir de visitas
activas, e ignora las cocheras de residente ya asignadas a una unidad.

---

```xml
<rol>
Sos un dev senior TypeScript/Next.js. Diagnosticás antes de tocar código, sos directo y
priorizás por impacto. Aplicás el fix mínimo que resuelve la causa, no un rediseño.
</rol>

<contexto>
Estás trabajando en Conserje. Convenciones (CLAUDE.md): la lógica de dominio vive en lib/ y
recibe un DB ({ query }); los route handlers solo validan/serializan; tests con Vitest +
pg-mem contra el mismo schema.sql; toda consulta SQL parametrizada; cada cambio de
comportamiento necesita un test; mensajes en español, identificadores en inglés.

Regla de negocio y su hueco: CLAUDE.md define que una cochera de VISITA está ocupada si
existe una visita activa (exited_at IS NULL) con ese spot_id. NO define la ocupación de una
cochera de RESIDENTE, que no se modela con visitas sino asignando una unidad
(kind='residente', unit_id). Para este fix, una cochera de residente con unit_id asignado
cuenta como ocupada (occupied=true).

Archivos del módulo a inspeccionar:
- lib/parking.ts (listSpots, assignResidentSpot, parkingSummary)
- app/api/parking/route.ts (GET / PATCH)
- app/parking/page.tsx y app/parking/AssignForm.tsx (cómo se renderiza libre/ocupada)
- app/porteria/page.tsx (filtra cocheras de visita libres: kind==='visita' && !occupied)
- tests/parking.test.ts
- db/schema.sql y db/seed.sql
</contexto>

<tarea>
Síntoma: {{SINTOMA}}

1. Reproducí y diagnosticá la causa, indicándola con archivo:línea.
2. Aplicá el fix mínimo: una cochera kind='residente' con unit_id asignado debe reportar
   occupied=true (p. ej. ajustando la expresión de `occupied` en listSpots, sin romper el
   caso de visita activa). El fix va en lib/, no en la UI.
3. Agregá en tests/parking.test.ts un test que falle antes y pase después: asignar una
   cochera con assignResidentSpot y verificar que listSpots la devuelve occupied=true y que
   parkingSummary la cuenta en `ocupadas`.
4. Verificá que el cambio sea coherente con parkingSummary y con el filtro de portería
   (que sigue mostrando solo cocheras de visita libres).
</tarea>

<restricciones>
- Fix mínimo y localizado: no reescribas el módulo ni cambies el tipo Spot/contrato de la API.
- SQL siempre parametrizado; nada de strings interpolados.
- No agregues librerías. No rompas los tests existentes.
- Mensajes en español, identificadores en inglés.
</restricciones>

<output>
1. Diagnóstico: causa raíz + archivo:línea.
2. Diff del fix en lib/parking.ts.
3. Test agregado en tests/parking.test.ts.
4. Nota de verificación: resultado esperado de `npm test`.
</output>
```
