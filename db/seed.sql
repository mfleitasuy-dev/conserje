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

-- Noticias, alertas y denuncias de ejemplo.
INSERT INTO news (title, body) VALUES
  ('Corte de agua programado', 'El martes de 9 a 13 hs se cortará el suministro de agua por mantenimiento de tanques.'),
  ('Reunión de consorcio', 'El jueves a las 19 hs en el SUM. Temario: expensas y obras del palier.');

INSERT INTO alerts (message, severity) VALUES
  ('Portón del garaje con falla intermitente, no forzar.', 'media'),
  ('Se reportó una persona ajena merodeando en planta baja.', 'alta');

INSERT INTO complaints (unit_id, category, description) VALUES
  (4, 'ruidos', 'Música a alto volumen pasada la medianoche en la unidad de al lado.'),
  (6, 'limpieza', 'El ascensor lleva tres días sin higienizar.');
