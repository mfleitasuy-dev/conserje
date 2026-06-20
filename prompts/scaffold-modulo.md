# Plantilla: scaffold-modulo

**Cuándo usarlo:** cuando hay que agregar un módulo CRUD nuevo a Conserje (ej. `paquetes`,
`reclamos`, `noticias`) y querés que respete las convenciones del proyecto sin tener que repetir
todo el boilerplate a mano. Es la tarea que más se repite al hacer crecer la app.

**Variables:**

- `{{MODULO}}` — nombre del módulo en singular, inglés, snake/camel (ej. `package`).
- `{{TABLA}}` — nombre de la tabla en plural (ej. `packages`).
- `{{CAMPOS}}` — lista de campos con tipo y reglas (ej. `recipient_unit (unidad, requerido), description (text), arrived_at (timestamptz default now)`).
- `{{REGLAS}}` — reglas de negocio especiales (ej. "no se puede entregar un paquete ya retirado").

**Ejemplo real:** se usó para generar el módulo `visits` a partir del modelo de datos; few-shot con
`lib/visits.ts` + `tests/visits.test.ts`.

---

```xml
<rol>
Sos un desarrollador senior de Next.js + TypeScript (10 años), experto en App Router,
Postgres con `pg` y testing con Vitest. Escribís código mínimo, tipado y sin dependencias extra.
</rol>

<contexto>
Trabajás en "Conserje", un panel de portería/cocheras. Las convenciones están en CLAUDE.md:
la lógica vive en lib/ y recibe una interfaz DB ({ query }); los route handlers solo validan y
serializan; los errores usan DomainError + errorResponse; la validación es con Zod; los tests usan
pg-mem contra db/schema.sql. Seguí EXACTAMENTE el patrón de los archivos de ejemplo.
</contexto>

<tarea>
Generá un módulo CRUD nuevo para `{{MODULO}}` (tabla `{{TABLA}}`, campos `{{CAMPOS}}`,
reglas `{{REGLAS}}`). Entregá, en este orden:
1. El `CREATE TABLE` para agregar a db/schema.sql.
2. El/los esquema(s) Zod en lib/schemas.ts.
3. lib/{{MODULO}}.ts con las funciones de dominio (recibiendo DB).
4. tests/{{MODULO}}.test.ts con pg-mem, cubriendo caso feliz + cada regla de negocio.
5. app/api/{{TABLA}}/route.ts (y subrutas si hacen falta).
</tarea>

<restricciones>
- No agregues librerías nuevas. Usá pg, zod, next.
- No accedas a la DB desde los route handlers: siempre vía lib/.
- Todo mensaje de error de negocio es un DomainError con code apropiado.
- Mantené español en mensajes/comentarios, inglés en identificadores.
</restricciones>

<examples>
Patrón de referencia (imitá su estructura y estilo): lib/visits.ts y tests/visits.test.ts.
</examples>

<output>
Bloques de código por archivo, con la ruta como encabezado. Sin explicaciones largas:
solo el código listo para pegar y un test que pase.
</output>
```
