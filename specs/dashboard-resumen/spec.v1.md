# SPEC — Resumen de denuncias y última noticia en el dashboard (v1)

> Spec ejecutable (SDD) del proyecto **Conserje**. Versión inicial, previa a la lectura
> crítica del plan; la refinada, con los gaps cerrados, está en [`spec.v2.md`](./spec.v2.md).
> Los gaps detectados al correr el plan están en [`gaps.md`](./gaps.md).

---

## 1. Problema y objetivo

**Problema.** El dashboard (`/`) resume visitas, cocheras y alertas, pero de los otros dos
módulos no dice nada: para saber si hay denuncias sin atender o qué se comunicó por último
hay que entrar a `/denuncias` y `/noticias`.

**Objetivo.** Sumar al dashboard la situación de **denuncias** y la **última noticia
publicada**, sin cambiar ninguno de los dos módulos.

Sin decisiones técnicas: el "cómo" va en la sección Stack / en el PLAN.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall calcular los resúmenes en la lógica de dominio
  (`lib/`), no en la página (mismo patrón que `parkingSummary`).
- **E1 (event-driven).** WHEN se abre el dashboard, el sistema muestra cuántas denuncias
  hay **abiertas** (`resolved_at` nulo).
- **E2 (event-driven).** WHEN se abre el dashboard, el sistema muestra la **última noticia
  publicada** (título y fecha).

## 3. Ejemplos de entrada y salida

```
complaintsSummary(db) → { "total": 5, "abiertas": 2 }
latestNews(db)        → { "id": 9, "title": "Corte de agua el jueves", ... }  | null
```

Dashboard: tarjeta "Denuncias abiertas" con el número, tarjeta "Última noticia" con el
título.

## 4. Edge cases y errores

- **Sin denuncias** → tarjeta en 0.
- **Sin noticias** → la tarjeta no rompe.

## 5. Antipatrones (qué NO hacer)

- **No** tocar los módulos de denuncias ni noticias (solo lectura).
- **No** duplicar reglas: el conteo de "abiertas" usa la misma definición que `/denuncias`.
- **No** agregar gráficos, series históricas ni auto-refresh → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- `lib/complaints.ts`: `complaintsSummary(db)`; `lib/news.ts`: `latestNews(db)`.
- `app/page.tsx`: tarjetas nuevas junto a las 5 existentes (íconos de `app/icons.tsx`).
- Tests con **Vitest + pg-mem** en `tests/complaints.test.ts` y `tests/news.test.ts`
  (conteos relativos: el seed trae denuncias y noticias).
- Mensajes/comentarios en español neutro; identificadores en inglés.
