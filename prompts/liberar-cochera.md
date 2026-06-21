# Plantilla: liberar-cochera

**Cuándo usarlo:** cuando hay que agregar al módulo de cocheras la acción inversa a asignar,
es decir liberar una cochera ocupada y dejarla disponible de nuevo.

**Variables:**

- `{{ESTADO_FINAL_RESIDENTE}}` — en qué estado queda una cochera de residente al liberarla
  (default: "vuelve a ser de visita: kind='visita', unit_id=NULL").

**Ejemplo real:** una cochera de residente asignada a una unidad se muestra "Ocupada" pero no
hay forma de liberarla: `assignResidentSpot` (lib/parking.ts) asigna pero no tiene inverso.

---

```xml
<rol>
Sos un dev senior TypeScript/Next.js. Respetás las convenciones del repo y hacés un cambio
acotado: agregás la funcionalidad reusando lo que ya existe, sin reescribir el módulo.
</rol>

<contexto>
Estás trabajando en Conserje. Convenciones (CLAUDE.md): la lógica de dominio vive en lib/ y
recibe un DB ({ query }); los route handlers solo validan/serializan y delegan en lib/; los
errores se lanzan con DomainError y se mapean con errorResponse (invalid→400, not_found→404,
conflict→409); validación con Zod en lib/schemas.ts; tests con Vitest + pg-mem; cada cambio
de comportamiento necesita un test; toda consulta SQL parametrizada; mensajes en español,
identificadores en inglés.

Estado actual del ciclo de una cochera:
- VISITA: ya tiene el ciclo completo. registerVisit (lib/visits.ts) le pone spot_id; listSpots
  (lib/parking.ts) la marca occupied y app/porteria/page.tsx la saca del desplegable de
  cocheras disponibles; registerExit (lib/visits.ts) la libera al marcar la salida de la visita.
- RESIDENTE: assignResidentSpot (lib/parking.ts) la asigna a una unidad (kind='residente',
  unit_id) y queda occupied=true, pero NO existe inverso para liberarla. Ese es el hueco.

Archivos a tocar/imitar: lib/parking.ts (listSpots, assignResidentSpot como patrón),
lib/visits.ts (registerExit, lógica de salida a reusar), lib/schemas.ts (assignSpotInput como
patrón), app/api/parking/route.ts (GET/PATCH actuales), app/parking/page.tsx (grilla de
cocheras), app/parking/AssignForm.tsx y app/porteria/ExitButton.tsx (patrón de client
component con useToast + router.refresh), tests/parking.test.ts.
</contexto>

<tarea>
Agregá una acción "Liberar" para una cochera ocupada, que despacha según el tipo de cochera.

1. Domain: agregá freeSpot(db, spotLabel) en lib/parking.ts.
   - Busca la cochera por label; si no existe → DomainError("...no existe", "not_found").
   - Si es residente con unit_id → {{ESTADO_FINAL_RESIDENTE}}.
   - Si es de visita con una visita activa (exited_at IS NULL) → marca la salida de esa visita
     reusando la lógica de registerExit (no la dupliques).
   - Si ya está libre → DomainError("la cochera ... ya está libre", "conflict").
   - Devuelve el Spot actualizado (reusá listSpots).
2. Schema: agregá freeSpotInput (spot_label) en lib/schemas.ts.
3. Route: agregá un handler DELETE en app/api/parking/route.ts que parsee freeSpotInput, llame
   freeSpot y serialice; errores con errorResponse.
4. UI: en app/parking/page.tsx mostrá un botón "Liberar" en cada cochera ocupada (nuevo client
   component FreeButton, espejo de ExitButton/AssignForm: fetch DELETE a /api/parking con
   { spot_label }, useToast para el feedback, router.refresh al terminar).
5. Tests en tests/parking.test.ts:
   - liberar una cochera de residente → vuelve a visita y occupied=false.
   - round-trip de visita: registrar visita con cochera → occupied=true; liberar → occupied=false.
   - liberar una cochera ya libre → conflict.
</tarea>

<restricciones>
- Reusá la lógica de salida existente (registerExit); no dupliques el UPDATE de exited_at.
- SQL siempre parametrizado. No agregues librerías. No rompas los tests existentes.
- No cambies el contrato de GET/PATCH ni el tipo Spot.
- Mensajes en español, identificadores en inglés.
</restricciones>

<output>
1. Diff por archivo: lib/parking.ts, lib/schemas.ts, app/api/parking/route.ts, la UI
   (page.tsx + FreeButton).
2. Tests agregados en tests/parking.test.ts.
3. Nota de verificación: resultado esperado de `npm test`.
</output>
```
