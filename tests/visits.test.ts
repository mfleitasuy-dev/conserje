import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  registerVisit,
  listVisits,
  listVisitsToday,
  registerExit,
  getVisit,
} from "@/lib/visits";
import { visitFilter } from "@/lib/schemas";
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
    // Atrasamos la entrada de Ana 1 segundo para que el orden por entered_at sea
    // determinista (ambas se insertan con now() y podrían empatar al milisegundo).
    // Debe ser un desplazamiento chico: uno grande cruza medianoche si la suite
    // corre en la primera hora del día y la visita deja de contar como "de hoy".
    await db.query(
      "UPDATE visits SET entered_at = now() - interval '1 second' WHERE id = $1",
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

/** YYYY-MM-DD local de un Date (para armar filtros relativos a "hoy"). */
function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Mueve entered_at de una visita a un instante exacto. */
async function setEnteredAt(db: DB, id: number, when: Date) {
  await db.query("UPDATE visits SET entered_at = $1 WHERE id = $2", [when, id]);
}

describe("listVisits", () => {
  it("sin filtros devuelve solo las visitas de hoy (E1)", async () => {
    const vieja = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    await setEnteredAt(db, vieja.id, ayer);
    await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
    });
    const list = await listVisits(db, {});
    expect(list).toHaveLength(1);
    expect(list[0].visitor_name).toBe("Beto");
  });

  it("filtra por fecha con rango semi-abierto y borde de medianoche (E2, G3)", async () => {
    const base = new Date();
    base.setDate(base.getDate() - 3);
    const dentro = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const finDelDia = new Date(base);
    finDelDia.setHours(23, 59, 59, 0);
    await setEnteredAt(db, dentro.id, finDelDia);
    const fuera = await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
    });
    const medianocheSiguiente = new Date(base);
    medianocheSiguiente.setDate(medianocheSiguiente.getDate() + 1);
    medianocheSiguiente.setHours(0, 0, 0, 0);
    await setEnteredAt(db, fuera.id, medianocheSiguiente);

    const list = await listVisits(db, { fecha: ymd(base) });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(dentro.id);
  });

  it("filtra por unidad (E3)", async () => {
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
    const list = await listVisits(db, { unidad: "1A" });
    expect(list).toHaveLength(1);
    expect(list[0].unit_label).toBe("1A");
  });

  it("combina fecha y unidad con AND (E4)", async () => {
    const otraFecha = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    await setEnteredAt(db, otraFecha.id, ayer);
    await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "4B",
    });
    await registerVisit(db, {
      visitor_name: "Cata",
      visitor_doc: "3",
      unidad: "1A",
    });
    const list = await listVisits(db, {
      fecha: ymd(new Date()),
      unidad: "4B",
    });
    expect(list).toHaveLength(1);
    expect(list[0].visitor_name).toBe("Beto");
  });

  it("ordena de la más reciente a la más antigua (U1)", async () => {
    const primera = await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const haceUnRato = new Date(Date.now() - 60_000);
    await setEnteredAt(db, primera.id, haceUnRato);
    await registerVisit(db, {
      visitor_name: "Beto",
      visitor_doc: "2",
      unidad: "1A",
    });
    const list = await listVisits(db, {});
    expect(list.map((v) => v.visitor_name)).toEqual(["Beto", "Ana"]);
  });

  it("unidad inexistente devuelve lista vacía, no error (UN3, G1)", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const list = await listVisits(db, { unidad: "ZZ" });
    expect(list).toEqual([]);
  });

  it("fecha futura devuelve lista vacía", async () => {
    await registerVisit(db, {
      visitor_name: "Ana",
      visitor_doc: "1",
      unidad: "4B",
    });
    const futuro = new Date();
    futuro.setDate(futuro.getDate() + 7);
    const list = await listVisits(db, { fecha: ymd(futuro) });
    expect(list).toEqual([]);
  });
});

describe("visitFilter", () => {
  it("acepta fecha válida y unidad con espacios", () => {
    const f = visitFilter.parse({ fecha: "2026-07-09", unidad: " 3A " });
    expect(f).toEqual({ fecha: "2026-07-09", unidad: "3A" });
  });

  it("ignora unidad vacía o solo espacios (S1, G4)", () => {
    expect(visitFilter.parse({ unidad: "   " }).unidad).toBeUndefined();
    expect(visitFilter.parse({}).unidad).toBeUndefined();
  });

  it("rechaza fechas mal formadas (UN1)", () => {
    for (const fecha of ["ayer", "09/07/2026", "2026-7-9"]) {
      expect(() => visitFilter.parse({ fecha })).toThrow();
    }
  });

  it("rechaza fechas inexistentes del calendario (UN1)", () => {
    for (const fecha of ["2026-13-40", "2026-02-30", "2026-00-01"]) {
      expect(() => visitFilter.parse({ fecha })).toThrow();
    }
  });

  it("rechaza fecha repetida en la query (UN2, G5)", () => {
    // El route pasa el array crudo de getAll("fecha") cuando viene repetida.
    expect(() =>
      visitFilter.parse({ fecha: ["2026-07-01", "2026-07-02"] }),
    ).toThrow();
  });
});
