import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import { listSpots, assignResidentSpot, parkingSummary } from "@/lib/parking";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("listSpots", () => {
  it("lista las cocheras del seed, todas libres", async () => {
    const spots = await listSpots(db);
    expect(spots).toHaveLength(6);
    expect(spots.every((s) => s.occupied === false)).toBe(true);
  });
});

describe("assignResidentSpot", () => {
  it("asigna una cochera a una unidad", async () => {
    const s = await assignResidentSpot(db, "V-03", "2B");
    expect(s.kind).toBe("residente");
    expect(s.unit_label).toBe("2B");
  });

  it("falla si la unidad no existe", async () => {
    await expect(assignResidentSpot(db, "V-03", "9Z")).rejects.toThrow(
      /unidad/i,
    );
  });
});

describe("parkingSummary", () => {
  it("cuenta cocheras libres y ocupadas", async () => {
    const sum = await parkingSummary(db);
    expect(sum).toEqual({ total: 6, ocupadas: 0, libres: 6 });
  });
});
