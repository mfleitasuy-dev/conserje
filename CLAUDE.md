# Conserje — convenciones

Panel de gestión de **accesos (portería)** y **cocheras** para edificios/torres.
Next.js (App Router) + TypeScript, Postgres, Vitest. Sin autenticación (MVP: kiosko de portería).

## Stack

- **Next.js 15 (App Router)**. Páginas como server components; APIs en `app/.../route.ts` (route handlers).
- **TypeScript** estricto. Alias de import `@/*` apunta a la raíz del proyecto.
- **Postgres** vía `pg`. La lógica de dominio vive en `lib/`.
- **Zod** para validación (`lib/schemas.ts`). **Vitest** sobre la lógica de dominio, con **pg-mem** (no requiere DB real).

## Convenciones

- La lógica de dominio (`lib/visits.ts`, `lib/parking.ts`) recibe un `DB` (interfaz mínima `{ query }` de `lib/db.ts`). Por eso es testeable con pg-mem y en producción corre con el `Pool` real (`getDb()`).
- Los **route handlers solo enrutan, validan y serializan**; delegan en `lib/`. Los errores se mapean con `errorResponse` (`lib/api.ts`): `ZodError`/`invalid` → **400**, `not_found` → **404**, `conflict` → **409**.
- Las reglas de negocio lanzan `DomainError` (`lib/errors.ts`) con su `code`.
- Respuestas siempre JSON vía `NextResponse.json`. Las páginas usan `export const dynamic = "force-dynamic"` para leer datos frescos.
- Mensajes y comentarios en **español neutro**; identificadores en **inglés**.
- Cada cambio de comportamiento necesita un **test** en `tests/`.

## Estructura

```
app/
  page.tsx              # dashboard: visitas activas + ocupación
  porteria/             # registrar visita, listar día, marcar salida
  parking/              # grilla de cocheras + asignación
  api/visits/route.ts   # GET (hoy), POST (registrar)
  api/visits/[id]/exit/route.ts  # POST (marcar salida)
  api/parking/route.ts  # GET (cocheras+resumen), PATCH (asignar)
  api/units/route.ts    # GET
lib/
  db.ts                 # Pool de pg + interfaz DB + getDb()
  schemas.ts            # esquemas Zod (compartidos con el MCP)
  visits.ts             # registerVisit, listVisitsToday, registerExit, getVisit
  parking.ts            # listSpots, assignResidentSpot, parkingSummary
  errors.ts, api.ts, format.ts
tests/                  # Vitest + pg-mem (helpers/db.ts)
db/                     # schema.sql, seed.sql
mcp/                    # MCP server propio (consorcio-mcp)
prompts/                # plantillas de prompt de desarrollo
```

## Comandos

- `npm run dev` — Next en `http://localhost:3000`.
- `npm test` — corre la suite de Vitest una vez.
- `npm run db:setup` — aplica `db/schema.sql` + `db/seed.sql` (usa `DATABASE_URL`).
- `npm run format` — Prettier sobre `app`, `lib`, `tests`, `mcp`.
- `npm run mcp:dev` — corre el MCP server (`mcp/src/index.ts`).

## Base de datos

- `DATABASE_URL` en `.env` (ej. `postgresql://conserje:conserje@localhost:5432/conserje`).
- Modelo: `units`, `parking_spots` (`kind` = `residente|visita`), `visits` (`entered_at`/`exited_at`).
- Una **cochera de visita está ocupada** si existe una visita activa (`exited_at IS NULL`) con ese `spot_id`.

## Decisiones (puedo explicar 2)

1. **Postgres en vez de persistencia en memoria.** Da persistencia real entre reinicios y —clave para
   este proyecto— permite que **la web y el MCP operen sobre la misma base** (dos clientes, una única
   fuente de verdad). El costo es levantar Postgres; lo aceptamos porque el MVP simula un sistema real
   de portería. Los tests no pagan ese costo: usan `pg-mem` contra el mismo `schema.sql`.
2. **Sin autenticación en el MVP.** La app es un **kiosko físico de portería** (una sola pantalla de
   uso interno), así que acotamos el scope de 2 días a las reglas de negocio (accesos + cocheras) en
   vez de gastar tiempo en login/roles. Autenticación y roles (Admin/Portero/Residente) quedan en el
   roadmap.
