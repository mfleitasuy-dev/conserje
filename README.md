# 🏢 Conserje

Panel de gestión de **accesos (portería)** y **cocheras** para edificios/torres. Digitaliza lo que
hoy se maneja con un cuaderno en portería y un grupo de WhatsApp: registro de visitas y ocupación de
cocheras, en una sola pantalla de uso interno.

Proyecto **capstone de BIOS 2026**: el producto es una web "normal" (sin IA adentro); lo que demuestra
es **desarrollo asistido por IA bien hecho** — toda la capa de tooling de IA está versionada en el repo.

## 🎥 Video-demo (3 min)

> **▶️ Ver demo:** _[pegar acá el link a YouTube/Vimeo]_

## ✅ Los 5 entregables

| # | Entregable | Dónde |
|---|------------|-------|
| 1 | Repo + `CLAUDE.md` | [`CLAUDE.md`](./CLAUDE.md) — convenciones + 2 decisiones explicadas |
| 2 | 5 plantillas de prompt | [`prompts/`](./prompts) — cada una con nombre, cuándo, variables, ejemplo y XML |
| 3 | Skill cargable | [`.claude/skills/nuevo-modulo`](./.claude/skills/nuevo-modulo) — scaffolda un módulo CRUD |
| 4 | MCP propio **+** subagente | [`mcp/`](./mcp) (`consorcio-mcp`) y [`.claude/agents/test-runner.md`](./.claude/agents/test-runner.md) |
| 5 | Video-demo | link arriba ☝️ |

## 🧱 Stack

Next.js 15 (App Router) · TypeScript · Postgres (`pg`) · Zod · Vitest (con `pg-mem`).

## 🚀 Cómo correr

Requisitos: Node 18+ y Postgres 16 (local).

```bash
# 1. Dependencias
npm install

# 2. Base de datos (ajustá DATABASE_URL si hace falta)
createdb conserje   # o usá tu instancia
cp .env.example .env
npm run db:setup    # aplica db/schema.sql + db/seed.sql

# 3. App
npm run dev         # http://localhost:3000

# 4. Tests (no necesitan Postgres: usan pg-mem)
npm test
```

### Pantallas

- **Dashboard** (`/`) — visitas en el edificio y ocupación de cocheras.
- **Portería** (`/porteria`) — registrar ingreso, listar el día, marcar salida.
- **Cocheras** (`/parking`) — estado de cocheras y asignación a residentes.

## 🤖 Capa de IA-dev

- **`CLAUDE.md`** — convenciones que sigue el agente al trabajar en el repo.
- **`prompts/`** — plantillas reutilizables (scaffold de módulo, endpoint, componente, tests, code-review).
- **Skill `nuevo-modulo`** — genera un módulo CRUD completo (tabla + Zod + dominio + tests + API) siguiendo las convenciones.
- **MCP `consorcio-mcp`** — expone la lógica de dominio como tools para que un agente **opere el edificio**:
  `registrar_visita`, `listar_visitas_hoy`, `registrar_salida`, `estado_parking`, `asignar_cochera`.
  Está registrado en [`.mcp.json`](./.mcp.json) y comparte `lib/` y la base con la web.

  ```bash
  npx tsx mcp/smoke.ts   # prueba: lista las tools y ejecuta algunas
  ```

- **Subagente `test-runner`** — corre la suite y reporta fallos en aislamiento.

## 🗺️ Roadmap (fuera del MVP)

Noticias/alertas a residentes · denuncias/reclamos con seguimiento · autenticación y roles
(Admin/Portero/Residente).
