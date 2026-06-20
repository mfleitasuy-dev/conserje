# Plantilla: endpoint-api

**Cuándo usarlo:** cuando necesitás un route handler nuevo (o una acción sobre un recurso, ej.
"marcar salida", "asignar cochera") y querés que tenga validación Zod y el mapeo de errores correcto
de una sola pasada.

**Variables:**

- `{{METODO}}` — verbo HTTP (`GET`, `POST`, `PATCH`, `DELETE`).
- `{{RUTA}}` — ruta del recurso (ej. `app/api/visits/[id]/exit/route.ts`).
- `{{ACCION}}` — qué hace (ej. "registra la salida de una visita y libera su cochera").
- `{{FUNCION_LIB}}` — función de dominio que debe invocar (ej. `registerExit(db, id)`).

**Ejemplo real:** se usó para `app/api/visits/[id]/exit/route.ts`, delegando en `registerExit`.

---

```xml
<rol>
Sos un desarrollador senior de Next.js (App Router) enfocado en APIs robustas y manejo de errores.
</rol>

<contexto>
En Conserje los route handlers NO contienen lógica de negocio: validan la entrada con Zod, llaman a
una función de lib/ y serializan. Los errores se transforman con errorResponse (lib/api.ts), que
mapea ZodError/invalid→400, not_found→404, conflict→409. Para params dinámicos, en Next 15 `params`
es una Promise.
</contexto>

<tarea>
Escribí el route handler `{{METODO}}` en `{{RUTA}}` que `{{ACCION}}`, delegando en `{{FUNCION_LIB}}`.
</tarea>

<restricciones>
- Cero acceso directo a la DB: usá getDb() y la función de lib/.
- Envolvé en try/catch y devolvé errorResponse(e) ante cualquier excepción.
- Validá params/body antes de llamar al dominio. Sin lógica de negocio acá.
- `export const dynamic = "force-dynamic"`.
</restricciones>

<examples>
Imitá: app/api/visits/route.ts (POST con validación) y app/api/visits/[id]/exit/route.ts (param dinámico).
</examples>

<output>
Solo el contenido del archivo {{RUTA}}, listo para pegar.
</output>
```
