import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createAlert, listAlerts } from "@/lib/alerts";
import { alertFilter } from "@/lib/schemas";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    // Repetido pasa el array crudo: falla el enum → 400 (UN2 de la spec).
    const raw = (name: string) => {
      const values = sp.getAll(name);
      return values.length > 1 ? values : (values[0] ?? undefined);
    };
    const filter = alertFilter.parse({
      estado: raw("estado"),
      severidad: raw("severidad"),
    });
    const alerts = await listAlerts(getDb(), filter);
    return NextResponse.json(alerts);
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const alert = await createAlert(getDb(), body);
    return NextResponse.json(alert, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
