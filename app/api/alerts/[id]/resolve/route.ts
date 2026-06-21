import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { resolveAlert } from "@/lib/alerts";
import { errorResponse } from "@/lib/api";
import { DomainError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const alertId = Number(id);
    if (!Number.isInteger(alertId)) {
      throw new DomainError("id de alerta inválido", "invalid");
    }
    const alert = await resolveAlert(getDb(), alertId);
    return NextResponse.json(alert);
  } catch (e) {
    return errorResponse(e);
  }
}
