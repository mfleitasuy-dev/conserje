import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { registerVisit, listVisits } from "@/lib/visits";
import { visitFilter } from "@/lib/schemas";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const fechas = sp.getAll("fecha");
    const filter = visitFilter.parse({
      // Repetida pasa el array crudo: falla z.string() → 400 (UN2 de la spec).
      fecha: fechas.length > 1 ? fechas : (fechas[0] ?? undefined),
      unidad: sp.get("unidad") ?? undefined,
    });
    const visits = await listVisits(getDb(), filter);
    return NextResponse.json(visits);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const visit = await registerVisit(getDb(), body);
    return NextResponse.json(visit, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
