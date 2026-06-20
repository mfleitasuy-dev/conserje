-- Esquema de Conserje: unidades, cocheras y visitas.

CREATE TABLE IF NOT EXISTS units (
  id    SERIAL PRIMARY KEY,
  label TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS parking_spots (
  id      SERIAL PRIMARY KEY,
  label   TEXT NOT NULL UNIQUE,
  kind    TEXT NOT NULL CHECK (kind IN ('residente', 'visita')),
  unit_id INTEGER REFERENCES units (id)
);

CREATE TABLE IF NOT EXISTS visits (
  id           SERIAL PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visitor_doc  TEXT NOT NULL,
  unit_id      INTEGER NOT NULL REFERENCES units (id),
  plate        TEXT,
  spot_id      INTEGER REFERENCES parking_spots (id),
  entered_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  exited_at    TIMESTAMPTZ
);
