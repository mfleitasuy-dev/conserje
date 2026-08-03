import type { DB } from "./db";
import { DomainError } from "./errors";
import { alertInput, type AlertInput, type AlertFilter } from "./schemas";

export type Severity = "baja" | "media" | "alta";

export type Alert = {
  id: number;
  message: string;
  severity: Severity;
  created_at: string;
  resolved_at: string | null;
};

const ALERT_SELECT = `
  SELECT id, message, severity, created_at, resolved_at
  FROM alerts`;

export async function getAlert(db: DB, id: number): Promise<Alert | null> {
  const { rows } = await db.query(`${ALERT_SELECT} WHERE id = $1`, [id]);
  return (rows[0] as Alert) ?? null;
}

export async function createAlert(db: DB, input: AlertInput): Promise<Alert> {
  const data = alertInput.parse(input);
  const { rows } = await db.query(
    "INSERT INTO alerts (message, severity) VALUES ($1, $2) RETURNING id",
    [data.message, data.severity],
  );
  return (await getAlert(db, rows[0].id as number))!;
}

export async function listAlerts(
  db: DB,
  filter: AlertFilter = { estado: "todas" },
): Promise<Alert[]> {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filter.estado === "activa") clauses.push("resolved_at IS NULL");
  if (filter.estado === "resuelta") clauses.push("resolved_at IS NOT NULL");
  if (filter.severidad) {
    params.push(filter.severidad);
    clauses.push(`severity = $${params.length}`);
  }
  const where = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await db.query(
    `${ALERT_SELECT}${where} ORDER BY created_at DESC`,
    params,
  );
  return rows as Alert[];
}

/** Alertas todavía sin resolver, la más reciente primero (para el dashboard). */
export async function listActiveAlerts(db: DB): Promise<Alert[]> {
  return listAlerts(db, { estado: "activa" });
}

export async function resolveAlert(db: DB, id: number): Promise<Alert> {
  const { rows } = await db.query(
    "UPDATE alerts SET resolved_at = now() WHERE id = $1 AND resolved_at IS NULL RETURNING id",
    [id],
  );
  if (rows.length === 0) {
    const existing = await getAlert(db, id);
    if (!existing)
      throw new DomainError(`la alerta ${id} no existe`, "not_found");
    throw new DomainError(`la alerta ${id} ya está resuelta`, "conflict");
  }
  return (await getAlert(db, id))!;
}
