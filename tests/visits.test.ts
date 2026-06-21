import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  registerVisit,
  listVisitsToday,
  registerExit,
  getVisit,
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
      registerVisit(db, {
        visitor_name: "Ana",
        visitor_doc: "1",
        unidad: "9Z",
      }),
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

  it("rechaza una cochera inexistente", async () => {
    await expect(
      registerVisit(db, {
        visitor_name: "Ana",
        visitor_doc: "1",
        unidad: "4B",
        cochera_visita: "V-99",
      }),
    ).rejects.toThrow(/no existe/i);
  });

  it("registra sin cochera ni patente: spot_label y plate quedan null", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "123",
      unidad: "4B",
    });
    expect(v.spot_label).toBeNull();
    expect(v.plate).toBeNull();
  });

  it("persiste patente y cochera en el registro devuelto", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "123",
      unidad: "4B",
      plate: "ABC1234",
      cochera_visita: "V-01",
    });
    expect(v.plate).toBe("ABC1234");
    expect(v.spot_label).toBe("V-01");
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

  it("permite reusar la cochera una vez liberada", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
      cochera_visita: "V-01",
    });
    await registerExit(db, v.id);
    const v2 = await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
      cochera_visita: "V-01",
    });
    expect(v2.spot_label).toBe("V-01");
  });
});

describe("getVisit", () => {
  it("devuelve la visita por id", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "123",
      unidad: "4B",
    });
    const found = await getVisit(db, v.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(v.id);
    expect(found!.visitor_name).toBe("Ana");
    expect(found!.unit_label).toBe("4B");
  });

  it("devuelve null si la visita no existe", async () => {
    expect(await getVisit(db, 999)).toBeNull();
  });
});

describe("listVisitsToday", () => {
  it("lista las visitas de hoy, la más nueva primero", async () => {
    const ana = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    // Atrasamos la entrada de Ana 1 hora para que el orden por entered_at sea
    // determinista (ambas se insertan con now() y podrían empatar al milisegundo).
    await db.query(
      "UPDATE visits SET entered_at = now() - interval '1 hour' WHERE id = $1",
      [ana.id],
    );
    await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
    });
    const list = await listVisitsToday(db);
    expect(list).toHaveLength(2);
    expect(list[0].visitor_name).toBe("Beto");
  });

  it("incluye las visitas que ya tienen salida", async () => {
    const v = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    await registerExit(db, v.id);
    const list = await listVisitsToday(db);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(v.id);
    expect(list[0].exited_at).not.toBeNull();
  });
});
