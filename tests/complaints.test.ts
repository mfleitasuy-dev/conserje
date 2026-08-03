import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  createComplaint,
  listComplaints,
  resolveComplaint,
  complaintsSummary,
  getComplaint,
} from "@/lib/complaints";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("createComplaint", () => {
  it("registra una denuncia y materializa la unidad", async () => {
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "Obra fuera de horario.",
    });
    expect(c.id).toBeGreaterThan(0);
    expect(c.unit_label).toBe("2A");
    expect(c.category).toBe("ruidos");
  });

  it("falla si la unidad no existe", async () => {
    await expect(
      createComplaint(db, {
        unidad: "9Z",
        category: "ruidos",
        description: "x",
      }),
    ).rejects.toThrow(/unidad/i);
  });

  it("falla si la categoría está vacía", async () => {
    await expect(
      createComplaint(db, { unidad: "2A", category: " ", description: "x" }),
    ).rejects.toThrow();
  });

  it("falla si la descripción está vacía", async () => {
    await expect(
      createComplaint(db, {
        unidad: "2A",
        category: "ruidos",
        description: "",
      }),
    ).rejects.toThrow();
  });
});

describe("listComplaints", () => {
  it("lista las denuncias, la más nueva primero", async () => {
    const vieja = await createComplaint(db, {
      unidad: "1A",
      category: "vieja",
      description: "x",
    });
    await db.query(
      "UPDATE complaints SET created_at = now() - interval '1 hour' WHERE id = $1",
      [vieja.id],
    );
    await createComplaint(db, {
      unidad: "1B",
      category: "nueva",
      description: "y",
    });
    const list = await listComplaints(db);
    expect(list[0].category).toBe("nueva");
  });
});

describe("getComplaint", () => {
  it("devuelve null si la denuncia no existe", async () => {
    expect(await getComplaint(db, 9999)).toBeNull();
  });
});

describe("resolveComplaint", () => {
  it("una denuncia recién creada está abierta (U1)", async () => {
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "x",
    });
    expect(c.resolved_at).toBeNull();
  });

  it("marca la denuncia como resuelta (E1)", async () => {
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "x",
    });
    const out = await resolveComplaint(db, c.id);
    expect(out.resolved_at).not.toBeNull();
  });

  it("la resuelta sigue en el listado con su fecha (E2, S1)", async () => {
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "x",
    });
    await resolveComplaint(db, c.id);
    const list = await listComplaints(db);
    const encontrada = list.find((x) => x.id === c.id);
    expect(encontrada).toBeDefined();
    expect(encontrada!.resolved_at).not.toBeNull();
  });

  it("falla si la denuncia ya está resuelta (UN2)", async () => {
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "x",
    });
    await resolveComplaint(db, c.id);
    await expect(resolveComplaint(db, c.id)).rejects.toThrow(/resuelta/i);
  });

  it("falla si la denuncia no existe (UN1)", async () => {
    await expect(resolveComplaint(db, 9999)).rejects.toThrow(/no existe/i);
  });
});

describe("complaintsSummary", () => {
  it("cuenta total y abiertas; resolver baja solo abiertas (E1, UN1)", async () => {
    const antes = await complaintsSummary(db);
    const c = await createComplaint(db, {
      unidad: "2A",
      category: "ruidos",
      description: "x",
    });
    const conNueva = await complaintsSummary(db);
    expect(conNueva.total).toBe(antes.total + 1);
    expect(conNueva.abiertas).toBe(antes.abiertas + 1);

    await resolveComplaint(db, c.id);
    const trasResolver = await complaintsSummary(db);
    expect(trasResolver.total).toBe(antes.total + 1);
    expect(trasResolver.abiertas).toBe(antes.abiertas);
  });
});
