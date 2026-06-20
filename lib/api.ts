import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DomainError } from "./errors";

/** Mapea errores de dominio/validación a respuestas JSON con el status correcto. */
export function errorResponse(e: unknown): NextResponse {
  if (e instanceof ZodError) {
    return NextResponse.json(
      { error: "datos inválidos", detalles: e.issues },
      { status: 400 },
    );
  }
  if (e instanceof DomainError) {
    const status =
      e.code === "not_found" ? 404 : e.code === "conflict" ? 409 : 400;
    return NextResponse.json({ error: e.message }, { status });
  }
  console.error(e);
  return NextResponse.json({ error: "error interno" }, { status: 500 });
}
