# 🏢 Conserje

Panel de gestión de **accesos (portería)**, **cocheras**, **noticias**, **alertas** y
**denuncias** para edificios/torres. Digitaliza lo que hoy se maneja con un cuaderno en
portería y un grupo de WhatsApp, en una sola pantalla de uso interno.

Proyecto **capstone de BIOS 2026**: el producto es una web "normal" (sin IA adentro); lo que demuestra
es **desarrollo asistido por IA bien hecho** — toda la capa de tooling de IA está versionada en el repo.

## 🚀 Cómo correr

Requisitos: Node 18+ y Postgres 16 local (`createdb`/`psql` en el PATH).

```bash
npm run setup && npm run dev   # http://localhost:3000
```

`npm run setup` es idempotente: instala dependencias, crea `.env` si falta, crea la base si no
existe, aplica `db/schema.sql` y siembra `db/seed.sql` **solo si la base está vacía**. Nunca
borra datos. Los tests no necesitan Postgres (usan `pg-mem`): `npm test`.

## ✅ Entregable 3 — Demo Day

| # | Qué | Dónde |
|---|-----|-------|
| 1 | Capstone funcionando en local (sin deploy) | `npm run setup && npm run dev` — flujo principal: dashboard → portería (ingreso) → cocheras → salida → alertas → denuncias |
| 2 | Repo con todo el recorrido del curso, al día | E1 y E2 abajo; guion del pitch en [`docs/pitch.md`](./docs/pitch.md) |
| 3 | ADR personal: plan de carrera a 90 días | [`docs/adr-personal.md`](./docs/adr-personal.md) — contexto → opciones → decisión → plan |

## 🎥 Video-demo (3 min)

> **▶️ Ver demo:** _[pegar acá el link a YouTube/Vimeo]_

## ✅ Entregable 1 — Los 5 entregables

| # | Entregable | Dónde |
|---|------------|-------|
| 1 | Repo + `CLAUDE.md` | [`CLAUDE.md`](./CLAUDE.md) — convenciones + 2 decisiones explicadas |
| 2 | Plantillas de prompt (9) | [`prompts/`](./prompts) — cada una con nombre, cuándo, variables, ejemplo y XML |
| 3 | Skill cargable | [`.claude/skills/nuevo-modulo`](./.claude/skills/nuevo-modulo) — scaffolda un módulo CRUD |
| 4 | MCP propio **+** subagente | [`mcp/`](./mcp) (`consorcio-mcp`) y [`.claude/agents/test-runner.md`](./.claude/agents/test-runner.md) |
| 5 | Video-demo | link arriba ☝️ |

## ✅ Entregable 2

| Artefacto | Dónde |
|-----------|-------|
| Prototipo funcional | esta app (ver [Cómo correr](#-cómo-correr)) |
| Diagramas C4 nivel 1 y 2 (Mermaid) | [`docs/architecture/`](./docs/architecture) |
| ADRs (template Nygard) | [`docs/architecture/adr/`](./docs/architecture/adr) |
| `CLAUDE.md` actualizado | [`CLAUDE.md`](./CLAUDE.md) |
| Subagentes (2) | [`.claude/agents/`](./.claude/agents) — `test-runner` y `ui-reviewer` |
| Specs SDD ejecutadas (5) + planes + evidencia | [`specs/`](./specs) — visitas-filtro, alertas-filtro, resolver-denuncias, dashboard-resumen, redisenio-visual |
| Browser agent (Playwright + RCCF + costo) | [`docs/browser-agent/`](./docs/browser-agent) |

## 🧱 Stack

Next.js 15 (App Router) · TypeScript · Postgres (`pg`) · Zod · Vitest (con `pg-mem`).

## 🖥️ Pantallas

UI en **tema oscuro** (rediseño de agosto 2026, ver [`specs/redisenio-visual/`](./specs/redisenio-visual)):
topbar con navegación, reloj en vivo y feedback de acciones con toasts.

- **Dashboard** (`/`) — visitas, ocupación de cocheras, alertas activas, denuncias abiertas
  y última noticia.
- **Portería** (`/porteria`) — registrar ingreso, listar el día, marcar salida. La API
  permite filtrar el historial por fecha y unidad (`GET /api/visits?fecha=…&unidad=…`).
- **Cocheras** (`/parking`) — estado de cocheras, asignación a residentes y liberación.
- **Noticias** (`/noticias`) — publicar y listar avisos del consorcio.
- **Alertas** (`/alertas`) — crear, listar y resolver alertas; la API filtra por estado y
  severidad (`GET /api/alerts?estado=…&severidad=…`).
- **Denuncias** (`/denuncias`) — registrar reclamos de residentes y marcarlos resueltos.

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

- **Subagentes** — [`test-runner`](./.claude/agents/test-runner.md) corre la suite y reporta
  fallos en aislamiento; [`ui-reviewer`](./.claude/agents/ui-reviewer.md) navega la UI con el
  **MCP de Playwright** (también en `.mcp.json`) y reporta pantallas rotas.
- **Specs SDD** — [`specs/`](./specs): cada feature con su ciclo spec v1 → gaps → spec v2 →
  plan → **evidencia de ejecución** (tests y commits).
- **Arquitectura** — [`docs/architecture/`](./docs/architecture) (C4 niveles 1 y 2 en
  Mermaid) y [`docs/architecture/adr/`](./docs/architecture/adr) (decisiones con template Nygard).
- **Browser agent** — [`docs/browser-agent/`](./docs/browser-agent): flujo de portería
  automatizado con Playwright, con prompt RCCF, corrida con capturas y doc de costo.

## 🗺️ Roadmap (fuera del MVP)

Autenticación y roles (Admin/Portero/Residente) · filtros de UI para visitas y alertas
(las APIs ya los soportan) · seguimiento con comentarios en denuncias.
