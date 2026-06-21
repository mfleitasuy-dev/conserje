import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import { listSpots, assignResidentSpot, parkingSummary } from "@/lib/parking";
import { registerVisit } from "@/lib/visits";
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

  it("marca ocupada la cochera con una visita activa", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    const spots = await listSpots(db);
    expect(spots.find((s) => s.label === "V-01")!.occupied).toBe(true);
    expect(spots.filter((s) => s.occupied)).toHaveLength(1);
  });

  it("muestra la unidad de una cochera residente del seed", async () => {
    const spots = await listSpots(db);
    const r01 = spots.find((s) => s.label === "R-01")!;
    expect(r01.kind).toBe("residente");
    expect(r01.unit_label).toBe("1A");
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

  it("falla si la cochera no existe", async () => {
    await expect(assignResidentSpot(db, "Z-99", "2B")).rejects.toThrow(
      /cochera/i,
    );
  });
});

describe("parkingSummary", () => {
  it("cuenta cocheras libres y ocupadas", async () => {
    const sum = await parkingSummary(db);
    expect(sum).toEqual({ total: 6, ocupadas: 0, libres: 6 });
  });

  it("refleja la ocupación tras registrar una visita con cochera", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    const sum = await parkingSummary(db);
    expect(sum).toEqual({ total: 6, ocupadas: 1, libres: 5 });
  });
});
