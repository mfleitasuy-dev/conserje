import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  listSpots,
  assignResidentSpot,
  freeSpot,
  parkingSummary,
} from "@/lib/parking";
import { registerVisit } from "@/lib/visits";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("listSpots", () => {
  it("lista las cocheras del seed: residentes ocupadas, visitas libres", async () => {
    const spots = await listSpots(db);
    expect(spots).toHaveLength(6);
    // Las 3 cocheras de residente del seed están asignadas a una unidad → ocupadas.
    expect(
      spots.filter((s) => s.kind === "residente").every((s) => s.occupied),
    ).toBe(true);
    // Las 3 de visita no tienen visita activa → libres.
    expect(
      spots.filter((s) => s.kind === "visita").every((s) => !s.occupied),
    ).toBe(true);
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
    // 3 residentes asignadas + V-01 con visita activa.
    expect(spots.filter((s) => s.occupied)).toHaveLength(4);
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

  it("deja la cochera asignada como ocupada", async () => {
    await assignResidentSpot(db, "V-03", "2B");
    const spots = await listSpots(db);
    expect(spots.find((s) => s.label === "V-03")!.occupied).toBe(true);
    // 3 residentes del seed + V-03 recién asignada.
    expect(await parkingSummary(db)).toEqual({
      total: 6,
      ocupadas: 4,
      libres: 2,
    });
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

describe("freeSpot", () => {
  it("libera una cochera de residente: vuelve a visita y queda libre", async () => {
    await assignResidentSpot(db, "V-03", "2B");
    const freed = await freeSpot(db, "V-03");
    expect(freed.kind).toBe("visita");
    expect(freed.unit_label).toBeNull();
    expect(freed.occupied).toBe(false);
  });

  it("libera una cochera del seed asignada a un residente", async () => {
    const freed = await freeSpot(db, "R-01");
    expect(freed.kind).toBe("visita");
    expect(freed.unit_label).toBeNull();
    expect(freed.occupied).toBe(false);
  });

  it("round-trip de visita: ocupa al registrar y libera al marcar la salida", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    expect(
      (await listSpots(db)).find((s) => s.label === "V-01")!.occupied,
    ).toBe(true);
    const freed = await freeSpot(db, "V-01");
    expect(freed.occupied).toBe(false);
  });

  it("falla si la cochera ya está libre", async () => {
    await expect(freeSpot(db, "V-02")).rejects.toThrow(/ya está libre/i);
  });

  it("falla si la cochera no existe", async () => {
    await expect(freeSpot(db, "Z-99")).rejects.toThrow(/no existe/i);
  });
});

describe("parkingSummary", () => {
  it("cuenta cocheras libres y ocupadas", async () => {
    const sum = await parkingSummary(db);
    // 3 cocheras de residente del seed están asignadas → ocupadas.
    expect(sum).toEqual({ total: 6, ocupadas: 3, libres: 3 });
  });

  it("refleja la ocupación tras registrar una visita con cochera", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    const sum = await parkingSummary(db);
    expect(sum).toEqual({ total: 6, ocupadas: 4, libres: 2 });
  });
});
