# ADR personal — Plan de carrera para los próximos 90 días

## Estado

Propuesta — 2026-08-21 (Demo Day, BIOS · Inteligencia Artificial para Software).
Horizonte: 90 días, hasta el **19/11/2026**. Se revisa en esa fecha con los hitos del plan como
criterio.

> Formato: el mismo ADR (Nygard) que uso para decisiones técnicas en
> [`docs/architecture/adr/`](./architecture/adr/), aplicado a mi carrera.

## Contexto

**Dónde estoy hoy.**

- **Experiencia:** entre 2 y 5 años como desarrollador de software, hoy en **Bantotal** (core
  bancario construido sobre GeneXus), en relación de dependencia.
- **Stack:** GeneXus (9 y 16) como herramienta principal, con Java/.NET alrededor;
  TypeScript/Next.js y Postgres los incorporé con el capstone.
- **Situación laboral:** estable. En la empresa las herramientas de IA para desarrollo **ya se
  usan**, así que no tengo que pelear el permiso: tengo que demostrar el impacto.
- **Qué me llevo del curso:** un toolkit versionado de desarrollo asistido por IA que ya uso de
  verdad: `CLAUDE.md` con convenciones, plantillas de prompt, la skill `nuevo-modulo`, un MCP
  propio (`consorcio-mcp`), subagentes (`test-runner`, `ui-reviewer`), specs SDD ejecutadas con
  evidencia, C4 y ADRs; y un capstone, **Conserje**, que lo demuestra de punta a punta. El
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

### Opción A — Aplicar IA en mi trabajo actual y volverme referente

Llevar el toolkit del curso y `genexus-mcp` a los repos y la KB de mi equipo en Bantotal, y medir
el impacto.

- **Pros:** riesgo bajo, ingreso estable, la empresa ya usa IA, el MCP ya existe y funciona;
  resultados visibles en semanas.
- **Contras:** el techo lo pone la empresa; hay que acordar antes qué pasa con un proyecto
  personal que se usa en el trabajo.
- **Aplica:** sí. Es el camino más corto entre lo que tengo y un resultado medible.

### Opción B — Buscar un rol nuevo usando el portafolio (Conserje + toolkit)

Posicionarme para roles full-stack o de "AI-assisted engineering" con el repo como carta de
presentación.

- **Pros:** posible salto salarial y de seniority; el capstone es evidencia concreta.
- **Contras:** una búsqueda seria consume más de 4 h/semana (entrevistas, pruebas técnicas); mi
  ventaja diferencial hoy está en GeneXus + IA, no en TypeScript.
- **Aplica:** no ahora. El empleo es estable y el apalancamiento está en el stack actual.

### Opción C — Proyecto propio: genexus-mcp como producto o servicio

Vender licencias, soporte o consultoría de adopción de IA a otras empresas que usan GeneXus.

- **Pros:** máximo upside; el nicho (GeneXus + agentes) tiene poca competencia.
- **Contras:** ingresos inciertos; vender requiere tiempo que no tengo; sin métricas de impacto
  no hay caso de venta.
- **Aplica:** todavía no. Primero necesito datos reales de adopción en un equipo.

## Decisión

Elijo la **Opción A**, con `genexus-mcp` como vehículo: que en 90 días **mi equipo en Bantotal
lo use en tareas reales, con el impacto medido**. Razones:

1. El producto ya existe y está probado en uso diario; lo que falta es adopción y medición, que
   sí caben en 4 h/semana.
2. Bantotal es GeneXus y ya usa IA: el camino de adopción es corto y el resultado es visible para
   mi líder y mi equipo.
3. Las métricas que salgan de esta etapa son exactamente lo que necesitaría la Opción C más
   adelante; no cierro esa puerta, la preparo.

No elijo **B** porque no quiero cambiar de empleo antes de fin de año y una búsqueda no entra en
el tiempo disponible. No elijo **C** porque sin un caso documentado con números no tengo qué
vender, y vender compite con las mismas 4 horas.

Esta decisión se revisa el **19/11/2026**: si no se cumplen al menos **2 de los 3** hitos del
mes 3, se reevalúan las opciones (en particular, si Bantotal no habilita el uso, la Opción C pasa
a ser la candidata).

## Plan de 90 días

| Mes | Fecha límite | Hitos (qué va a estar hecho) | Evidencia |
|-----|--------------|------------------------------|-----------|
| 1 | **21/09/2026** | 1. Acuerdo con mi líder en Bantotal sobre el uso de `genexus-mcp` en el trabajo (alcance, propiedad intelectual, en qué tareas) <br> 2. Línea base: lista de las 10 tareas GeneXus más frecuentes del equipo con su tiempo actual a mano <br> 3. Setup reproducible validado en 2 máquinas de compañeros con `verify-setup.ps1` | Mail o minuta del acuerdo; planilla de línea base; issues cerrados en `genexus-mcp` |
| 2 | **21/10/2026** | 1. Tres compañeros usando el MCP en tareas reales, con un `CLAUDE.md` y 3 plantillas de prompt del equipo (el toolkit del curso aplicado) <br> 2. Medición antes/después en las 10 tareas de la línea base <br> 3. Los 5 faltantes o bugs más reportados resueltos por PR | PRs en `genexus-mcp`; planilla de medición; registro de uso |
| 3 | **19/11/2026** | 1. Demo interna a equipo y líder con las métricas, y una decisión de Bantotal sobre adopción oficial <br> 2. Caso documentado (sin datos sensibles) publicado como artículo o charla en la comunidad GeneXus <br> 3. Revisión de este ADR: decisión confirmada o nuevo ADR (incluye evaluar la Opción C con los datos) | Presentación y minuta; link al artículo o charla; nuevo ADR o este actualizado |

**Ritmo semanal:** dos bloques de 2 horas entre semana, fuera del horario de Bantotal.

## Consecuencias

### Positivas

- Tengo un criterio explícito (hitos con fecha y evidencia) para saber si voy bien.
- `genexus-mcp` pasa de herramienta personal a caso medido dentro de una empresa real, que es el
  activo que cualquiera de las tres opciones necesita después.
- El toolkit del curso (convenciones, prompts, SDD) se aplica en un equipo GeneXus, no solo en el
  capstone.

### Negativas

- Durante 90 días no invierto en búsqueda laboral ni en comercializar el proyecto.
- Conserje queda como está (MVP sin auth); el roadmap del capstone espera.
- Dependo de una decisión de Bantotal (hito 1 del mes 1): si no habilitan el uso, el plan cambia
  de vía y lo registro en un nuevo ADR.
