# Conserje — convenciones

Panel de gestión de **accesos (portería)**, **cocheras**, **noticias**, **alertas** y
**denuncias** para edificios/torres.
Next.js (App Router) + TypeScript, Postgres, Vitest. Sin autenticación (MVP: kiosko de portería).

## Stack

- **Next.js 15 (App Router)**. Páginas como server components; APIs en `app/.../route.ts` (route handlers).
- **TypeScript** estricto. Alias de import `@/*` apunta a la raíz del proyecto.
- **Postgres** vía `pg`. La lógica de dominio vive en `lib/`.
- **Zod** para validación (`lib/schemas.ts`). **Vitest** sobre la lógica de dominio, con **pg-mem** (no requiere DB real).

## Convenciones

- La lógica de dominio (`lib/visits.ts`, `lib/parking.ts`, `lib/news.ts`, `lib/alerts.ts`, `lib/complaints.ts`) recibe un `DB` (interfaz mínima `{ query }` de `lib/db.ts`). Por eso es testeable con pg-mem y en producción corre con el `Pool` real (`getDb()`).
- Los **route handlers solo enrutan, validan y serializan**; delegan en `lib/`. Los errores se mapean con `errorResponse` (`lib/api.ts`): `ZodError`/`invalid` → **400**, `not_found` → **404**, `conflict` → **409**.
- Las reglas de negocio lanzan `DomainError` (`lib/errors.ts`) con su `code`.
- Respuestas siempre JSON vía `NextResponse.json`. Las páginas usan `export const dynamic = "force-dynamic"` para leer datos frescos.
- Mensajes y comentarios en **español neutro**; identificadores en **inglés**.
- Cada cambio de comportamiento necesita un **test** en `tests/`.

## Estructura

```
app/
  page.tsx              # dashboard: visitas, ocupación, alertas, denuncias, última noticia
  porteria/             # registrar visita, listar día, marcar salida
  parking/              # grilla de cocheras + asignación + liberar
  noticias/             # publicar y listar noticias
  alertas/              # crear, listar y resolver alertas
  denuncias/            # registrar, listar y resolver denuncias
  ui/                   # componentes compartidos (Toast)
  api/visits/route.ts   # GET (filtros fecha/unidad), POST (registrar)
  api/visits/[id]/exit/route.ts  # POST (marcar salida)
  api/parking/route.ts  # GET (cocheras+resumen), PATCH (asignar), DELETE (liberar)
  api/news/route.ts     # GET, POST
  api/alerts/route.ts   # GET (filtros estado/severidad), POST
  api/alerts/[id]/resolve/route.ts     # POST
  api/complaints/route.ts              # GET, POST
  api/complaints/[id]/resolve/route.ts # POST
  api/units/route.ts    # GET
lib/
  db.ts                 # Pool de pg + interfaz DB + getDb()
  schemas.ts            # esquemas Zod, inputs y filtros (compartidos con el MCP)
  visits.ts             # registerVisit, listVisits, listVisitsToday, registerExit, getVisit
  parking.ts            # listSpots, assignResidentSpot, freeSpot, parkingSummary
  news.ts               # createNews, listNews, latestNews, getNews
  alerts.ts             # createAlert, listAlerts, listActiveAlerts, resolveAlert, getAlert
  complaints.ts         # createComplaint, listComplaints, resolveComplaint, complaintsSummary
  errors.ts, api.ts, format.ts
tests/                  # Vitest + pg-mem (helpers/db.ts)
db/                     # schema.sql, seed.sql
mcp/                    # MCP server propio (consorcio-mcp)
prompts/                # plantillas de prompt de desarrollo
specs/                  # specs SDD por feature (v1 → gaps → v2 → plan → evidencia)
docs/                   # architecture (C4), adr (decisiones), browser-agent (evidencia E2E)
.claude/agents/         # subagentes: test-runner, ui-reviewer
```

## Comandos

- `npm run dev` — Next en `http://localhost:3000`.
- `npm run build` / `npm start` — build de producción y servidor.
- `npm test` — corre la suite de Vitest una vez (`npm run test:watch` para modo watch).
- `npm run db:setup` — aplica `db/schema.sql` + `db/seed.sql` (usa `DATABASE_URL`).
- `npm run format` — Prettier sobre `app`, `lib`, `tests`, `mcp`.
- `npm run mcp:dev` — corre el MCP server (`mcp/src/index.ts`).

## Base de datos

- `DATABASE_URL` en `.env` (ej. `postgresql://conserje:conserje@localhost:5432/conserje`).
- Modelo: `units`, `parking_spots` (`kind` = `residente|visita`), `visits`
  (`entered_at`/`exited_at`), `news`, `alerts` (`resolved_at`), `complaints` (`resolved_at`).
- Una **cochera de visita está ocupada** si existe una visita activa (`exited_at IS NULL`) con ese `spot_id`.

## Decisiones

Las decisiones de arquitectura están formalizadas como ADRs en [`docs/adr/`](./docs/adr/):

1. [ADR-001 — Postgres en vez de persistencia en memoria](./docs/adr/adr-001-postgres-en-vez-de-memoria.md):
   la web y el MCP operan sobre la misma base (dos clientes, una única fuente de verdad);
   los tests no pagan el costo (usan `pg-mem` contra el mismo `schema.sql`).
2. [ADR-002 — Sin autenticación en el MVP](./docs/adr/adr-002-sin-autenticacion-en-el-mvp.md):
   la app es un kiosko físico de portería; auth y roles (Admin/Portero/Residente) quedan en
   el roadmap.

Los diagramas C4 (contexto y contenedores, en Mermaid) viven en
[`docs/architecture/`](./docs/architecture/) y deben mantenerse fieles al código: si una
feature cambia la arquitectura, se actualiza el C4 y se deja el ADR de esa decisión.
