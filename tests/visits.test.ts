import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  registerVisit,
  listVisitsToday,
  registerExit,
} from "@/lib/visits";
import { listSpots } from "@/lib/parking";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("registerVisit", () => {
  it("registra una visita básica", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "123",
      unidad: "4B",
    });
    expect(v.id).toBeGreaterThan(0);
    expect(v.unit_label).toBe("4B");
    expect(v.exited_at).toBeNull();
  });

  it("falla si la unidad no existe", async () => {
    await expect(
      registerVisit(db, { visitor_name: "Ana", visitor_doc: "1", unidad: "9Z" }),
    ).rejects.toThrow(/unidad/i);
  });

  it("asigna una cochera de visita y la marca ocupada", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      plate: "ABC1234",
      cochera_visita: "V-01",
    });
    const spots = await listSpots(db);
    expect(spots.find((s) => s.label === "V-01")!.occupied).toBe(true);
  });

  it("rechaza una cochera ya ocupada", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    await expect(
      registerVisit(db, {
        visitor_name: "Beto",
        visitor_doc: "2",
        unidad: "1A",
        cochera_visita: "V-01",
      }),
    ).rejects.toThrow(/ocupada/i);
  });

  it("rechaza una cochera que no es de visita", async () => {
    await expect(
      registerVisit(db, {
        visitor_name: "Ana",
        visitor_doc: "1",
        unidad: "4B",
        cochera_visita: "R-01",
      }),
    ).rejects.toThrow(/visita/i);
  });
});

describe("registerExit", () => {
  it("marca la salida y libera la cochera", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    const out = await registerExit(db, v.id);
    expect(out.exited_at).not.toBeNull();
    const spots = await listSpots(db);
    expect(spots.find((s) => s.label === "V-01")!.occupied).toBe(false);
  });

  it("falla si la visita ya salió", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    await registerExit(db, v.id);
    await expect(registerExit(db, v.id)).rejects.toThrow(/salida/i);
  });

  it("falla si la visita no existe", async () => {
    await expect(registerExit(db, 999)).rejects.toThrow(/no existe/i);
  });
});

describe("listVisitsToday", () => {
  it("lista las visitas de hoy, la más nueva primero", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
    });
    const list = await listVisitsToday(db);
    expect(list).toHaveLength(2);
    expect(list[0].visitor_name).toBe("Beto");
  });
});
