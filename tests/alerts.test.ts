import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import {
  createAlert,
  listAlerts,
  listActiveAlerts,
  resolveAlert,
  getAlert,
} from "@/lib/alerts";
import { alertFilter } from "@/lib/schemas";
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

  it("sin filtro equivale a estado=todas (E1, G1)", async () => {
    const a = await createAlert(db, { message: "x" });
    await resolveAlert(db, a.id);
    const sinFiltro = await listAlerts(db);
    const todas = await listAlerts(db, { estado: "todas" });
    expect(todas.map((x) => x.id)).toEqual(sinFiltro.map((x) => x.id));
  });

  it("estado=activa excluye resueltas; estado=resuelta solo resueltas (E2)", async () => {
    const a = await createAlert(db, { message: "para resolver" });
    await resolveAlert(db, a.id);
    const activas = await listAlerts(db, { estado: "activa" });
    expect(activas.every((x) => x.resolved_at === null)).toBe(true);
    expect(activas.some((x) => x.id === a.id)).toBe(false);
    const resueltas = await listAlerts(db, { estado: "resuelta" });
    expect(resueltas.every((x) => x.resolved_at !== null)).toBe(true);
    expect(resueltas.some((x) => x.id === a.id)).toBe(true);
  });

  it("filtra por severidad (E3)", async () => {
    const alta = await createAlert(db, { message: "x", severity: "alta" });
    await createAlert(db, { message: "y", severity: "baja" });
    const soloAltas = await listAlerts(db, {
      estado: "todas",
      severidad: "alta",
    });
    expect(soloAltas.every((x) => x.severity === "alta")).toBe(true);
    expect(soloAltas.some((x) => x.id === alta.id)).toBe(true);
  });

  it("combina estado y severidad con AND (E4)", async () => {
    const activaAlta = await createAlert(db, {
      message: "activa alta",
      severity: "alta",
    });
    const resueltaAlta = await createAlert(db, {
      message: "resuelta alta",
      severity: "alta",
    });
    await resolveAlert(db, resueltaAlta.id);
    await createAlert(db, { message: "activa baja", severity: "baja" });
    const list = await listAlerts(db, { estado: "activa", severidad: "alta" });
    expect(list.some((x) => x.id === activaAlta.id)).toBe(true);
    expect(list.some((x) => x.id === resueltaAlta.id)).toBe(false);
    expect(list.every((x) => x.severity === "alta" && !x.resolved_at)).toBe(
      true,
    );
  });

  it("ordena de la más reciente a la más antigua (U1)", async () => {
    const vieja = await createAlert(db, { message: "vieja" });
    await db.query(
      "UPDATE alerts SET created_at = now() - interval '1 second' WHERE id = $1",
      [vieja.id],
    );
    const nueva = await createAlert(db, { message: "nueva" });
    const list = await listAlerts(db);
    const posNueva = list.findIndex((x) => x.id === nueva.id);
    const posVieja = list.findIndex((x) => x.id === vieja.id);
    expect(posNueva).toBeGreaterThanOrEqual(0);
    expect(posNueva).toBeLessThan(posVieja);
  });

  it("listActiveAlerts equivale al filtro estado=activa (U2, G3)", async () => {
    const a = await createAlert(db, { message: "x" });
    await resolveAlert(db, a.id);
    await createAlert(db, { message: "sigue activa" });
    const wrapper = await listActiveAlerts(db);
    const filtrada = await listAlerts(db, { estado: "activa" });
    expect(wrapper.map((x) => x.id)).toEqual(filtrada.map((x) => x.id));
  });
});

describe("alertFilter", () => {
  it("aplica default todas y acepta los enums (E1)", () => {
    expect(alertFilter.parse({})).toEqual({ estado: "todas" });
    expect(alertFilter.parse({ estado: "activa", severidad: "alta" })).toEqual({
      estado: "activa",
      severidad: "alta",
    });
  });

  it("ignora valores vacíos o con espacios (S1, G4)", () => {
    expect(alertFilter.parse({ estado: "", severidad: "  " })).toEqual({
      estado: "todas",
    });
  });

  it("rechaza valores fuera del enum (UN1)", () => {
    expect(() => alertFilter.parse({ estado: "abierta" })).toThrow();
    expect(() => alertFilter.parse({ severidad: "urgente" })).toThrow();
  });

  it("rechaza parámetros repetidos (UN2, G2)", () => {
    // El route pasa el array crudo de getAll cuando el parámetro viene repetido.
    expect(() =>
      alertFilter.parse({ estado: ["activa", "resuelta"] }),
    ).toThrow();
    expect(() => alertFilter.parse({ severidad: ["alta", "baja"] })).toThrow();
  });
});

describe("getAlert", () => {
  it("devuelve null si la alerta no existe", async () => {
    expect(await getAlert(db, 9999)).toBeNull();
  });
});
