import type { DB } from "./db";
import { DomainError } from "./errors";
import { complaintInput, type ComplaintInput } from "./schemas";

export type Complaint = {
  id: number;
  unit_label: string;
  category: string;
  description: string;
  created_at: string;
};

const COMPLAINT_SELECT = `
  SELECT c.id, u.label AS unit_label, c.category, c.description, c.created_at
  FROM complaints c
  JOIN units u ON u.id = c.unit_id`;

async function unitIdByLabel(db: DB, label: string): Promise<number> {
  const { rows } = await db.query("SELECT id FROM units WHERE label = $1", [
    label,
  ]);
  if (rows.length === 0)
    throw new DomainError(`la unidad ${label} no existe`, "not_found");
  return rows[0].id as number;
}

export async function getComplaint(
  db: DB,
  id: number,
): Promise<Complaint | null> {
  const { rows } = await db.query(`${COMPLAINT_SELECT} WHERE c.id = $1`, [id]);
  return (rows[0] as Complaint) ?? null;
}

export async function createComplaint(
  db: DB,
  input: ComplaintInput,
): Promise<Complaint> {
  const data = complaintInput.parse(input);
  const unitId = await unitIdByLabel(db, data.unidad);
  const { rows } = await db.query(
    `INSERT INTO complaints (unit_id, category, description)
     VALUES ($1, $2, $3) RETURNING id`,
    [unitId, data.category, data.description],
  );
  return (await getComplaint(db, rows[0].id as number))!;
}

export async function listComplaints(db: DB): Promise<Complaint[]> {
  const { rows } = await db.query(
    `${COMPLAINT_SELECT} ORDER BY c.created_at DESC`,
  );
  return rows as Complaint[];
}
