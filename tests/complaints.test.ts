import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  createComplaint,
  listComplaints,
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
