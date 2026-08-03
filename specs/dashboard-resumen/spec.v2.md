# SPEC — Resumen de denuncias y última noticia en el dashboard (v2, refinado)

> Versión **refinada** de [`spec.v1.md`](./spec.v1.md): incorpora como criterios EARS
> explícitos las decisiones que en v1 quedaban implícitas
> (ver [`gaps.md`](./gaps.md), gaps G1–G4).

---

## 1. Problema y objetivo

**Problema.** El dashboard no dice nada de denuncias ni de noticias.

**Objetivo.** Sumar al dashboard las **denuncias abiertas** y la **última noticia
publicada**, sin cambiar ninguno de los dos módulos.

## 2. Criterios de aceptación (EARS)

- **U1 (ubicuo).** The system shall calcular los resúmenes en la lógica de dominio
  (`lib/`), reusando los listados existentes y contando en JS — patrón `parkingSummary`,
  sin SQL de agregación nuevo. *(G3)*
- **E1 (event-driven).** WHEN se abre el dashboard, el sistema muestra la cantidad de
  denuncias **abiertas** (`resolved_at` nulo); el resumen expone `{ total, abiertas }`. *(G1)*
- **E2 (event-driven).** WHEN se abre el dashboard, el sistema muestra el **título y la
  fecha** de la última noticia publicada. *(G2)*
- **S1 (state-driven / optional).** WHERE no hay noticias, la tarjeta muestra `—` y la
  página no rompe. *(G2)*
- **UN1 (unwanted, IF…THEN).** IF una denuncia se resuelve, THEN deja de contar como
  abierta (misma definición de "abierta" que usa `/denuncias`).

## 3. Ejemplos de entrada y salida

```
complaintsSummary(db) → { "total": 5, "abiertas": 2 }
latestNews(db)        → { "id": 9, "title": "Corte de agua el jueves", ... }
latestNews(db)        → null        (sin noticias)
```

Dashboard: tarjeta "Denuncias abiertas" con `abiertas`; tarjeta "Última noticia" con el
título y la fecha (o `—`).

## 4. Edge cases y errores

- **Sin denuncias** → `{ total: 0, abiertas: 0 }`, tarjeta en 0.
- **Todas resueltas** → abiertas en 0, total no cambia (UN1).
- **Sin noticias** → `latestNews` devuelve `null`, tarjeta `—` (S1).

## 5. Antipatrones (qué NO hacer)

- **No** tocar los módulos de denuncias ni noticias (solo lectura).
- **No** duplicar la definición de "abierta" (E1/UN1 la comparten con `/denuncias`).
- **No** mostrar el cuerpo de la noticia en el dashboard: el detalle vive en `/noticias`. *(G4)*
- **No** agregar gráficos, series históricas ni auto-refresh → **fuera de scope**.

---

## Stack / decisiones ya tomadas (puente al PLAN)

- `lib/complaints.ts`: `complaintsSummary(db)` sobre `listComplaints` (JS count).
- `lib/news.ts`: `latestNews(db)` sobre `listNews` (ya ordena DESC; primer elemento).
- `app/page.tsx`: dos tarjetas nuevas en el `Promise.all` y la grilla existentes
  (`FlagIcon`, `NewspaperIcon`); variante CSS chica para tarjeta de texto.
- Tests con **Vitest + pg-mem**, conteos relativos (el seed trae 2 denuncias y 2 noticias).
- Mensajes/comentarios en español neutro; identificadores en inglés.

---

### Changelog v1 → v2

Cerrados los gaps G1–G4 (ver [`gaps.md`](./gaps.md)): abiertas en la tarjeta (E1), título +
fecha en vez de conteo con `—` de fallback (E2/S1), conteo en JS patrón `parkingSummary`
(U1), sin panel de detalle (antipatrones). Al regenerar el plan sobre v2, **no aparecen
supuestos nuevos** → spec listo.
