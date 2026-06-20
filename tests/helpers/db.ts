import { newDb } from "pg-mem";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { DB } from "@/lib/db";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Crea una DB en memoria (pg-mem) con el schema y el seed aplicados. */
export function makeTestDb(): DB {
  const mem = newDb();
  mem.public.none(readFileSync(join(root, "db/schema.sql"), "utf8"));
  mem.public.none(readFileSync(join(root, "db/seed.sql"), "utf8"));
  const { Pool } = mem.adapters.createPg();
  return new Pool() as unknown as DB;
}
