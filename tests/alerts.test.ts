import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  createAlert,
  listAlerts,
  listActiveAlerts,
  resolveAlert,
  getAlert,
} from "@/lib/alerts";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("createAlert", () => {
  it("crea una alerta con severidad", async () => {
    const a = await createAlert(db, {
      message: "Humo en el subsuelo",
      severity: "alta",
    });
    expect(a.id).toBeGreaterThan(0);
    expect(a.severity).toBe("alta");
    expect(a.resolved_at).toBeNull();
  });

  it("usa severidad media por defecto", async () => {
    const a = await createAlert(db, { message: "Aviso general" });
    expect(a.severity).toBe("media");
  });

  it("rechaza una severidad inválida", async () => {
    await expect(
      createAlert(db, {
        message: "x",
        severity: "urgente" as never,
      }),
    ).rejects.toThrow();
  });
});

describe("resolveAlert", () => {
  it("marca la alerta como resuelta", async () => {
    const a = await createAlert(db, { message: "x", severity: "baja" });
    const out = await resolveAlert(db, a.id);
    expect(out.resolved_at).not.toBeNull();
  });

  it("falla si la alerta ya está resuelta", async () => {
    const a = await createAlert(db, { message: "x" });
    await resolveAlert(db, a.id);
    await expect(resolveAlert(db, a.id)).rejects.toThrow(/resuelta/i);
  });

  it("falla si la alerta no existe", async () => {
    await expect(resolveAlert(db, 9999)).rejects.toThrow(/no existe/i);
  });
});

describe("listActiveAlerts", () => {
  it("excluye las alertas resueltas", async () => {
    const a = await createAlert(db, { message: "Resolver esta" });
    const activasAntes = await listActiveAlerts(db);
    await resolveAlert(db, a.id);
    const activasDespues = await listActiveAlerts(db);
    expect(activasDespues).toHaveLength(activasAntes.length - 1);
    expect(activasDespues.some((x) => x.id === a.id)).toBe(false);
  });
});

describe("listAlerts", () => {
  it("incluye también las resueltas", async () => {
    const a = await createAlert(db, { message: "x" });
    await resolveAlert(db, a.id);
    const todas = await listAlerts(db);
    expect(todas.some((x) => x.id === a.id)).toBe(true);
  });
});

describe("getAlert", () => {
  it("devuelve null si la alerta no existe", async () => {
    expect(await getAlert(db, 9999)).toBeNull();
  });
});
