# ADR-001 — Postgres en vez de persistencia en memoria

## Estado

Aceptada — 2026-08-03.

## Contexto

Conserje es el MVP de un sistema de portería: registra visitas, cocheras, noticias, alertas y
denuncias de un edificio. La alternativa más barata para un MVP de pocos días era persistir en
memoria (o en un archivo JSON), sin base de datos.

Pero el proyecto tiene dos clientes de la misma información: la web app (Next.js) que usa el
portero en el kiosko y el MCP server `consorcio-mcp` que usa un agente IA. Son **dos procesos
distintos**: con persistencia en memoria cada uno tendría su propio estado y verían edificios
diferentes. Además, el MVP simula un sistema real de portería, donde perder el registro de
visitas en cada reinicio no es aceptable.

## Decisión

Usar **Postgres** como única fuente de verdad, accedido vía `pg`. La web y el MCP comparten la
misma `DATABASE_URL` y la misma capa de dominio (`lib/`), que recibe una interfaz `DB` mínima
(`{ query }`, definida en `lib/db.ts`).

Los tests no pagan el costo de la base real: corren con **pg-mem** contra el mismo
`db/schema.sql`, así que la suite no requiere Postgres levantado.

## Consecuencias

### Positivas

- Persistencia real entre reinicios: las visitas, cocheras y avisos sobreviven a un deploy o a
  un corte.
- Web y MCP operan sobre la misma base: dos clientes, una única fuente de verdad. Lo que el
  agente IA registra por MCP aparece de inmediato en la pantalla del portero, y viceversa.
- El dominio depende de una interfaz `DB` mínima, por lo que la misma lógica corre contra el
  `Pool` real en producción y contra `pg-mem` en tests.
- El esquema queda explícito y versionado en `db/schema.sql`.

### Negativas

- Requiere levantar Postgres local para desarrollar (`createdb` + `.env` con `DATABASE_URL`).
- El setup de la base es manual: hay que correr `npm run db:setup` antes de usar la app.
- La evolución del esquema es artesanal: `CREATE TABLE IF NOT EXISTS` no agrega columnas a
  tablas existentes, así que los cambios de esquema sobre una base ya creada exigen `ALTER`
  manual (no hay herramienta de migraciones en el MVP).
