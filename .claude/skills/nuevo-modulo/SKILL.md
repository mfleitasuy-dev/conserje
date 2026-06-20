---
name: nuevo-modulo
description: Usar al agregar un módulo CRUD nuevo al proyecto Conserje (por ejemplo paquetes, reclamos, noticias, expensas). Se activa cuando el usuario pide "crear un módulo", "nuevo CRUD", "agregar una entidad/tabla", "scaffold de un módulo" o describe una entidad nueva con sus campos para la app de portería. Genera tabla + Zod + lógica de dominio + tests pg-mem + route handlers siguiendo las convenciones del repo.
---

# Skill: nuevo módulo CRUD (Conserje)

Generás un módulo CRUD completo y consistente con las convenciones de Conserje
(ver `CLAUDE.md`). Es la tarea de desarrollo que más se repite al hacer crecer la app:
cada entidad nueva (paquetes, reclamos, noticias…) sigue el mismo patrón.

## Cuándo se dispara

Cuando el usuario quiere incorporar una entidad/tabla nueva al sistema. Si no aclara los campos
ni las reglas, **preguntá primero** (máximo 2 preguntas): nombre del módulo, campos con tipos y
reglas de negocio.

## Datos que necesitás

- **Módulo** (singular, inglés): ej. `package`.
- **Tabla** (plural): ej. `packages`.
- **Campos**: nombre, tipo y reglas (requerido, FK a `units`, default…).
- **Reglas de negocio**: validaciones especiales (ej. "no entregar un paquete ya retirado").

## Pasos (en orden)

1. **Schema** — agregá el `CREATE TABLE IF NOT EXISTS {{tabla}}` a `db/schema.sql`, usando los
   tipos del proyecto (`SERIAL PRIMARY KEY`, `TEXT`, `INTEGER REFERENCES units(id)`, `TIMESTAMPTZ`).
2. **Validación** — agregá el/los esquema(s) Zod en `lib/schemas.ts` (con `.trim().min(1)` en textos).
3. **Dominio** — creá `lib/{{modulo}}.ts`: funciones que **reciben `DB`** (de `lib/db.ts`) y lanzan
   `DomainError` con el `code` correcto (`invalid` | `not_found` | `conflict`). Nunca interpoles SQL:
   usá parámetros `$1, $2…`.
4. **Tests** — creá `tests/{{modulo}}.test.ts` con Vitest + `makeTestDb()` (pg-mem), cubriendo el
   caso feliz y **cada regla de negocio**. Usá `beforeEach` para aislar.
5. **API** — creá `app/api/{{tabla}}/route.ts` (y subrutas para acciones puntuales): los handlers solo
   validan, llaman a `lib/` y serializan; ante error devuelven `errorResponse(e)`. Agregá
   `export const dynamic = "force-dynamic"`.
6. **Verificá** — corré `npm test` y confirmá que la suite queda en verde antes de cerrar.

## Patrón de referencia (few-shot)

Imitá la estructura y el estilo de estos archivos ya existentes:

- `lib/visits.ts` — dominio con validación, FKs y reglas de negocio.
- `tests/visits.test.ts` — tests pg-mem (caso feliz + errores).
- `app/api/visits/route.ts` y `app/api/visits/[id]/exit/route.ts` — handlers.

## Reglas

- No agregues dependencias nuevas (solo `pg`, `zod`, `next`).
- Lógica de negocio **solo** en `lib/`; nunca en los route handlers.
- Español en mensajes/comentarios, inglés en identificadores.
- No cierres la tarea con tests en rojo.
