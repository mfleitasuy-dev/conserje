import { Pool } from "pg";

/** Interfaz mínima que consume la lógica de dominio (compatible con pg y pg-mem). */
export type DB = {
  query: (
    text: string,
    params?: unknown[],
  ) => Promise<{ rows: Record<string, unknown>[] }>;
};

let pool: Pool | undefined;

/** Pool singleton de Postgres, configurado vía DATABASE_URL. */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/** Devuelve el pool tipado como DB para la lógica de dominio. */
export function getDb(): DB {
  return getPool() as unknown as DB;
}
