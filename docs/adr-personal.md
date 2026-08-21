# ADR personal — Plan de carrera para los próximos 90 días

## Estado

Propuesta — 2026-08-21 (Demo Day, BIOS · Inteligencia Artificial para Software).
Horizonte: 90 días, hasta el **19/11/2026**. Se revisa en esa fecha con los hitos del plan como
criterio.

> Formato: el mismo ADR (Nygard) que uso para decisiones técnicas en
> [`docs/architecture/adr/`](./architecture/adr/), aplicado a mi carrera.

## Contexto

**Dónde estoy hoy.**

- **Experiencia:** 5 años como desarrollador de software, hoy en **Bantotal** (core bancario
  construido sobre GeneXus), en relación de dependencia.
- **Stack:** GeneXus (9 y 16) como herramienta principal, con Java/.NET alrededor;
  TypeScript/Next.js y Postgres los incorporé durante el curso.
- **Situación laboral:** estable. En la empresa las herramientas de IA para desarrollo **ya se
  usan** y existe un **área dedicada a desarrollo con IA**: sé qué hacen y conozco a su gente.
  No tengo que pelear el permiso; tengo que demostrar el impacto.
- **Qué me llevo del curso:** un toolkit versionado de desarrollo asistido por IA que ya uso de
  verdad: `CLAUDE.md` con convenciones, plantillas de prompt, la skill `nuevo-modulo`, un MCP
  propio (`consorcio-mcp`), subagentes (`test-runner`, `ui-reviewer`), specs SDD ejecutadas con
  evidencia, C4 y ADRs. Las habilidades que practiqué de punta a punta: **especificar** con SDD
  (spec → gaps → plan → evidencia), **diseñar** con C4 y ADRs, **construir** un MCP propio y
  subagentes, y **verificar** con tests, QA automatizado en navegador y revisión de código. El
  aprendizaje central fue pasar de "pedirle código" a **especificar, delegar y verificar**, con el
  tooling (prompts, skills, MCPs, agentes) versionado en el repo para que se repita.
- **Un activo que ya existe:** `genexus-mcp`, un proyecto personal que arranqué el 9 de julio de
  2026 y al que le dediqué 97 commits en un mes: un monorepo de cuatro MCP servers que operan
  Knowledge Bases GeneXus 9 y 16 desde Claude Code (`code-9`, `code-16`: procedures, SDTs,
  transacciones, tablas, specify/compile/build, XPZ; `ui-9`, `ui-16`: web panels Descartes) más
  una librería compartida y un agente de solo lectura. Reemplaza la mayor parte de las tareas de
  programación GeneXus que hoy se hacen a mano. **Lo uso a diario y otros compañeros ya lo
  tienen instalado**, con setup reproducible (`SETUP.md`, `verify-setup.ps1`). Lo desarrollo por
  mi cuenta, fuera del horario.

**Restricciones reales:** hasta **4 horas por semana** fuera del trabajo (unas 50 horas en los
90 días). Bantotal todavía no tiene una postura formal sobre el proyecto (propiedad intelectual,
uso en horario): es lo primero a resolver. Montevideo, español; no hay otra obligación que compita.

## Opciones

### Opción A — Aplicar IA en mi equipo actual y volverme referente

Llevar el toolkit del curso y `genexus-mcp` a los repos y la KB de mi equipo en Bantotal, y medir
el impacto.

- **Pros:** riesgo bajo, ingreso estable, la empresa ya usa IA, el MCP ya existe y funciona;
  resultados visibles en semanas.
- **Contras:** el impacto queda acotado a mi equipo; hay que acordar antes qué pasa con un
  proyecto personal que se usa en el trabajo.
- **Aplica:** sí, pero como paso, no como destino: es la evidencia que necesita la Opción C.

### Opción B — Buscar un rol nuevo usando las habilidades del curso como portafolio

Posicionarme para roles full-stack o de "AI-assisted engineering" con las habilidades
demostradas (SDD, MCP propio, subagentes, arquitectura documentada) como carta de presentación.

- **Pros:** posible salto salarial y de seniority; hay evidencia concreta (specs ejecutadas,
  MCP, agentes, ADRs) y no solo un CV.
- **Contras:** una búsqueda seria consume más de 4 h/semana (entrevistas, pruebas técnicas); mi
  ventaja diferencial hoy está en GeneXus + IA, no en TypeScript.
- **Aplica:** no ahora. El empleo es estable y el apalancamiento está en el stack actual.

### Opción C — Unirme o colaborar con el área de desarrollo con IA de Bantotal

Proponer, en base a lo aprendido y a `genexus-mcp`, sumarme al área de IA de la empresa o abrir
un intercambio permanente con ella, para enriquecer los productos que desarrollan con agentes
que operen GeneXus y con el método (specs, MCPs, subagentes, verificación) del curso.

- **Pros:** el área ya existe y conozco a su gente, así que la propuesta es concreta y no
  hipotética; `genexus-mcp` es una demo que funciona, no una idea; es crecimiento de rol sin
  cambiar de empresa; el impacto escala más allá de mi equipo.
- **Contras:** depende de decisiones de la empresa (estructura, prioridades, propiedad
  intelectual del proyecto personal); el riesgo es que el intercambio quede en charlas si no
  llego con un caso medido.
- **Aplica:** sí. Es donde lo que aprendí vale más.

## Decisión

Elijo la **Opción C**: en 90 días, una **propuesta formal al área de desarrollo con IA de
Bantotal** para unirme o colaborar, respaldada por `genexus-mcp` en uso real y medido en mi
equipo (la Opción A como primer paso y como evidencia). Razones:

1. El producto ya existe y está probado en uso diario; lo que falta es medirlo y ponerlo frente a
   quien puede escalarlo, y eso cabe en 4 h/semana.
2. El área de IA ya existe y tengo contacto directo: el camino más corto entre lo que sé hacer y
   un rol donde se use.
3. Enriquecer productos reales de la empresa con agentes sobre GeneXus es exactamente la
   combinación de mis 5 años de GeneXus y lo que aprendí en el curso; nadie más en mi entorno
   junta las dos cosas.

No elijo **B** porque no quiero cambiar de empleo antes de fin de año y una búsqueda no entra en
el tiempo disponible. No me quedo en **A** porque dejaría el impacto acotado a mi equipo cuando
hay un área cuyo trabajo es justamente este.

Esta decisión se revisa el **19/11/2026**: si no se cumplen al menos **2 de los 3** hitos del
mes 3, se reevalúan las opciones. Si Bantotal no habilita el uso de `genexus-mcp` o el área no
abre la puerta, la Opción A queda como plan mínimo y la B vuelve a la mesa.

## Plan de 90 días

| Mes | Fecha límite | Hitos (qué va a estar hecho) | Evidencia |
|-----|--------------|------------------------------|-----------|
| 1 | **21/09/2026** | 1. Acuerdo con mi líder sobre el uso de `genexus-mcp` en el trabajo (alcance, propiedad intelectual, en qué tareas) <br> 2. Primera reunión con el área de IA: demo de `genexus-mcp` y del toolkit, y relevamiento de en qué productos suyos podría aportar <br> 3. Línea base en mi equipo: las 10 tareas GeneXus más frecuentes con su tiempo actual a mano, y setup validado en 2 máquinas con `verify-setup.ps1` | Minuta del acuerdo; minuta de la reunión con el área; planilla de línea base |
| 2 | **21/10/2026** | 1. Tres compañeros usando el MCP en tareas reales, con un `CLAUDE.md` y 3 plantillas de prompt del equipo, y medición antes/después en las 10 tareas <br> 2. Propuesta escrita al área de IA (unirme o colaboración definida) con un caso de uso concreto sobre uno de sus productos <br> 3. Los 5 faltantes o bugs más reportados resueltos por PR | Planilla de medición y registro de uso; documento de propuesta enviado; PRs en `genexus-mcp` |
| 3 | **19/11/2026** | 1. Decisión de Bantotal sobre la propuesta (incorporación al área, colaboración acordada, o no) <br> 2. Una contribución concreta entregada a un producto del área: prueba de concepto, integración o feature con agentes sobre GeneXus <br> 3. Revisión de este ADR: decisión confirmada o nuevo ADR | Minuta de la decisión; PR o demo de la contribución; nuevo ADR o este actualizado |

**Ritmo semanal:** dos bloques de 2 horas entre semana, fuera del horario de Bantotal.

## Consecuencias

### Positivas

- Tengo un criterio explícito (hitos con fecha y evidencia) para saber si voy bien.
- `genexus-mcp` pasa de herramienta personal a caso medido dentro de una empresa real, y ese caso
  es la base de la propuesta al área de IA.
- Las habilidades del curso (convenciones, prompts, SDD, MCP, agentes) se aplican en productos
  reales de la empresa, no solo en un proyecto de estudio.
- Si la propuesta prospera, es un cambio de rol hacia desarrollo con IA sin cambiar de empresa.

### Negativas

- Durante 90 días no invierto en búsqueda laboral.
- Las habilidades de frontend (TypeScript/Next.js) que sumé en el curso quedan en segundo plano
  frente a GeneXus durante estos 90 días.
- Dependo de decisiones ajenas (mi líder en el mes 1, el área de IA en el mes 3): si no
  prosperan, los 90 días igual dejan el caso medido, y el plan cambia de vía en un nuevo ADR.
