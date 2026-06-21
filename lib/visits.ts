import type { DB } from "./db";
import { DomainError } from "./errors";
import { visitInput, type VisitInput } from "./schemas";

export type Visit = {
  id: number;
  visitor_name: string;
  visitor_doc: string;
  unit_label: string;
  plate: string | null;
  spot_label: string | null;
  entered_at: string;
  exited_at: string | null;
};

const VISIT_SELECT = `
  SELECT v.id, v.visitor_name, v.visitor_doc, u.label AS unit_label,
         v.plate, s.label AS spot_label, v.entered_at, v.exited_at
  FROM visits v
  JOIN units u ON u.id = v.unit_id
  LEFT JOIN parking_spots s ON s.id = v.spot_id`;

async function unitIdByLabel(db: DB, label: string): Promise<number> {
  const { rows } = await db.query("SELECT id FROM units WHERE label = $1", [
    label,
  ]);
  if (rows.length === 0)
    throw new DomainError(`la unidad ${label} no existe`, "not_found");
  return rows[0].id as number;
}

/** Resuelve y valida la cochera de visita; devuelve su id o null. */
async function resolveVisitorSpot(
  db: DB,
  label: string | undefined,
): Promise<number | null> {
  if (!label) return null;
  const { rows } = await db.query(
    "SELECT id, kind FROM parking_spots WHERE label = $1",
    [label],
  );
  if (rows.length === 0)
    throw new DomainError(`la cochera ${label} no existe`, "not_found");
  if (rows[0].kind !== "visita")
    throw new DomainError(`la cochera ${label} no es de visita`, "invalid");
  const spotId = rows[0].id as number;
  const occupied = await db.query(
    "SELECT 1 FROM visits WHERE spot_id = $1 AND exited_at IS NULL",
    [spotId],
  );
  if (occupied.rows.length > 0)
    throw new DomainError(`la cochera ${label} está ocupada`, "conflict");
  return spotId;
}

export async function getVisit(db: DB, id: number): Promise<Visit | null> {
  const { rows } = await db.query(`${VISIT_SELECT} WHERE v.id = $1`, [id]);
  return (rows[0] as Visit) ?? null;
}

export async function registerVisit(db: DB, input: VisitInput): Promise<Visit> {
  const data = visitInput.parse(input);
  const unitId = await unitIdByLabel(db, data.unidad);
  const spotId = await resolveVisitorSpot(db, data.cochera_visita);
  const { rows } = await db.query(
    `INSERT INTO visits (visitor_name, visitor_doc, unit_id, plate, spot_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.visitor_name, data.visitor_doc, unitId, data.plate ?? null, spotId],
  );
  return (await getVisit(db, rows[0].id as number))!;
}

export async function listVisitsToday(db: DB): Promise<Visit[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { rows } = await db.query(
    `${VISIT_SELECT} WHERE v.entered_at >= $1 ORDER BY v.entered_at DESC`,
    [start],
  );
  return rows as Visit[];
}

export async function registerExit(db: DB, id: number): Promise<Visit> {
  const { rows } = await db.query(
    "UPDATE visits SET exited_at = now() WHERE id = $1 AND exited_at IS NULL RETURNING id",
    [id],
  );
  if (rows.length === 0) {
    const existing = await getVisit(db, id);
    if (!existing)
      throw new DomainError(`la visita ${id} no existe`, "not_found");
    throw new DomainError(
      `la visita ${id} ya tiene salida registrada`,
      "conflict",
    );
  }
  return (await getVisit(db, id))!;
}
