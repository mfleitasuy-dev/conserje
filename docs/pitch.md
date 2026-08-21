# Guion del Demo Day — Conserje

Estructura obligatoria: **contexto → problema → solución → demo**. Duración objetivo: ~5 min.
Demo en vivo desde mi máquina compartiendo pantalla; nada se busca en vivo.

## 0. Antes de empezar (checklist)

- [ ] `npm run setup && npm run dev` corriendo → `http://localhost:3000` abierto en el dashboard.
- [ ] Terminal aparte lista con `npx tsx mcp/smoke.ts` escrito (sin ejecutar).
- [ ] Pestañas del repo abiertas en GitHub, en este orden:
  `CLAUDE.md` · `specs/` · `docs/architecture/` (C4) · `docs/architecture/adr/` · `docs/adr-personal.md`.
- [ ] Video de respaldo a mano (**regrabar con la UI nueva en tema oscuro**; el de junio muestra la UI vieja).
- [ ] Notificaciones del sistema silenciadas.

## 1. Contexto (30 s)

"Conserje nace de cómo funciona hoy la portería de un edificio o torre: un cuaderno para anotar
visitas, un pizarrón o la memoria del portero para las cocheras, y un grupo de WhatsApp para
avisos, alertas y reclamos."

## 2. Problema (30 s)

"Esa información está dispersa y no deja rastro: nadie sabe quién entró ayer a la 3B, qué
cochera de visita está libre ahora, ni qué reclamos siguen abiertos. Cuando pasa algo, se
reconstruye a mano."

## 3. Solución (1 min)

"Conserje es un panel interno de portería: accesos, cocheras, noticias, alertas y denuncias en una
sola pantalla. Es una web Next.js + Postgres, sin IA adentro a propósito.

Lo que demuestra el proyecto es **cómo se construyó**: desarrollo asistido por IA con todo el
tooling versionado en el repo —" *(mostrar pestañas, 5 s cada una)*

- `CLAUDE.md`: convenciones que sigue el agente + 2 decisiones de arquitectura.
- `prompts/` y la skill `nuevo-modulo`: cómo repito tareas sin reescribir instrucciones.
- `mcp/`: un MCP propio, `consorcio-mcp`, que expone el dominio como tools — un agente puede
  *operar* el edificio sobre la misma base que la web.
- `specs/`: 5 features hechas con SDD — spec v1 → gaps → v2 → plan → evidencia.
- `docs/architecture/`: C4 nivel 1 y 2, y los ADRs (Postgres vs memoria; sin auth en el MVP).

## 4. Demo en vivo (2–3 min)

Ruta exacta, sin desvíos:

1. **Dashboard `/`** — "resumen en vivo: visitas de hoy, ocupación de cocheras, alertas activas, denuncias abiertas."
2. **Portería `/porteria`** — registrar un ingreso (visitante + unidad + cochera de visita `V-01`). "Queda registrado con hora."
3. **Cocheras `/parking`** — "la `V-01` aparece ocupada porque hay una visita activa. Misma base, otra vista."
4. Volver a **Portería** — marcar salida. Volver a **Cocheras**: `V-01` libre.
5. **Alertas `/alertas`** — crear una alerta de severidad alta y resolverla.
6. **Denuncias `/denuncias`** — mostrar una abierta y marcarla resuelta.
7. *(Opcional, si hay tiempo)* Terminal: `npx tsx mcp/smoke.ts` — "el MCP registra una visita
   por tool; refresco la web y aparece." Cierra la idea de dos clientes, una fuente de verdad.

**Si algo falla:** no debuguear. Decir "uso el video de respaldo", reproducirlo, y seguir.

## 5. Cierre (15 s)

"El producto es el pretexto; el entregable real es un flujo de trabajo con IA que ya uso y que
está en el repo para que cualquiera lo reproduzca. Mi plan de los próximos 90 días está en
`docs/adr-personal.md`." → preguntas.

## Posibles preguntas

- **¿Por qué sin IA dentro del producto?** Porque el objetivo del curso es el desarrollo asistido; meter IA sin necesidad sería ruido.
- **¿Por qué sin auth?** ADR-002: es un kiosko físico de portería; auth y roles están en el roadmap.
- **¿Cómo sabés que el agente no rompió nada?** Cada feature tiene tests (83, Vitest + pg-mem), evidencia en `specs/*/evidencia.md` y el subagente `test-runner`.
- **¿Qué medirías del proceso?** Tiempo spec→merge por feature y retrabajo por gaps detectados en la revisión de spec.
