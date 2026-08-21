import { describe, it, expect } from "vitest";
import { horaCorta, fechaLarga } from "@/lib/format";

describe("horaCorta", () => {
  it("formatea la hora como HH:mm en 24 h (E1)", () => {
    expect(horaCorta(new Date(2026, 8, 9, 11, 37))).toBe("11:37");
  });

  it("usa 00 a la medianoche, no 24 (E1)", () => {
    expect(horaCorta(new Date(2026, 8, 9, 0, 5))).toBe("00:05");
  });
});

describe("fechaLarga", () => {
  it("formatea la fecha como '9 de setiembre' (es-UY)", () => {
    expect(fechaLarga(new Date(2026, 8, 9))).toBe("9 de setiembre");
  });
});
