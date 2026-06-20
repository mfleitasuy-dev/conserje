-- Datos de ejemplo: 8 unidades y 6 cocheras (3 de residente, 3 de visita).

INSERT INTO units (label) VALUES
  ('1A'), ('1B'), ('2A'), ('2B'), ('3A'), ('3B'), ('4A'), ('4B')
ON CONFLICT (label) DO NOTHING;

INSERT INTO parking_spots (label, kind, unit_id) VALUES
  ('R-01', 'residente', 1),
  ('R-02', 'residente', 2),
  ('R-03', 'residente', 3),
  ('V-01', 'visita', NULL),
  ('V-02', 'visita', NULL),
  ('V-03', 'visita', NULL)
ON CONFLICT (label) DO NOTHING;
