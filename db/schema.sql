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

CREATE TABLE IF NOT EXISTS news (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id          SERIAL PRIMARY KEY,
  message     TEXT NOT NULL,
  severity    TEXT NOT NULL DEFAULT 'media' CHECK (severity IN ('baja', 'media', 'alta')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS complaints (
  id          SERIAL PRIMARY KEY,
  unit_id     INTEGER NOT NULL REFERENCES units (id),
  category    TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
