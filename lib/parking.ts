import type { DB } from "./db";
import { DomainError } from "./errors";

export type Spot = {
  id: number;
  label: string;
  kind: "residente" | "visita";
  unit_label: string | null;
  occupied: boolean;
};

export async function listSpots(db: DB): Promise<Spot[]> {
  const { rows } = await db.query(
    `SELECT s.id, s.label, s.kind, u.label AS unit_label,
            (av.spot_id IS NOT NULL) AS occupied
     FROM parking_spots s
     LEFT JOIN units u ON u.id = s.unit_id
     LEFT JOIN (
       SELECT DISTINCT spot_id FROM visits
       WHERE exited_at IS NULL AND spot_id IS NOT NULL
     ) av ON av.spot_id = s.id
     ORDER BY s.label`,
  );
  return rows.map((r) => ({
    id: r.id as number,
    label: r.label as string,
    kind: r.kind as Spot["kind"],
    unit_label: (r.unit_label as string | null) ?? null,
    occupied: !!r.occupied,
  }));
}

export async function assignResidentSpot(
  db: DB,
  spotLabel: string,
  unitLabel: string,
): Promise<Spot> {
  const u = await db.query("SELECT id FROM units WHERE label = $1", [
    unitLabel,
  ]);
  if (u.rows.length === 0)
    throw new DomainError(`la unidad ${unitLabel} no existe`, "not_found");
  const s = await db.query("SELECT id FROM parking_spots WHERE label = $1", [
    spotLabel,
  ]);
  if (s.rows.length === 0)
    throw new DomainError(`la cochera ${spotLabel} no existe`, "not_found");
  await db.query(
    "UPDATE parking_spots SET kind = 'residente', unit_id = $1 WHERE id = $2",
    [u.rows[0].id, s.rows[0].id],
  );
  const spots = await listSpots(db);
  return spots.find((x) => x.label === spotLabel)!;
}

export async function parkingSummary(
  db: DB,
): Promise<{ total: number; ocupadas: number; libres: number }> {
  const spots = await listSpots(db);
  const ocupadas = spots.filter((s) => s.occupied).length;
  return { total: spots.length, ocupadas, libres: spots.length - ocupadas };
}
