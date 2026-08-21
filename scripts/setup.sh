#!/usr/bin/env bash
# Setup idempotente de Conserje: se puede correr las veces que haga falta.
# Nunca borra ni re-siembra una base existente.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ 1/4 Dependencias"
npm install

echo "▶ 2/4 Variables de entorno"
if [ ! -f .env ]; then cp .env.example .env; echo "  .env creado desde .env.example"; else echo "  .env ya existe, no se toca"; fi
set -a; . ./.env; set +a
DATABASE_URL="${DATABASE_URL:-postgresql://conserje:conserje@localhost:5432/conserje}"

echo "▶ 3/4 Base de datos"
DB_NAME="${DATABASE_URL##*/}"; DB_NAME="${DB_NAME%%\?*}"
if createdb "$DB_NAME" 2>/dev/null; then echo "  base '$DB_NAME' creada"; else echo "  base '$DB_NAME' ya existe (o la crea tu instancia), se reutiliza"; fi
psql "$DATABASE_URL" -q -v ON_ERROR_STOP=1 -f db/schema.sql
UNITS=$(psql "$DATABASE_URL" -tAc "select count(*) from units")
if [ "$UNITS" = "0" ]; then
  psql "$DATABASE_URL" -q -v ON_ERROR_STOP=1 -f db/seed.sql
  echo "  seed aplicado"
else
  echo "  la base ya tiene datos ($UNITS unidades), seed omitido"
fi

echo "▶ 4/4 Listo. Levantá la app con: npm run dev  →  http://localhost:3000"
