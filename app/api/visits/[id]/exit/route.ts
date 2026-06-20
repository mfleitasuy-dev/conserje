import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { registerExit } from "@/lib/visits";
import { errorResponse } from "@/lib/api";
import { DomainError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const visitId = Number(id);
    if (!Number.isInteger(visitId)) {
      throw new DomainError("id de visita inválido", "invalid");
    }
    const visit = await registerExit(getDb(), visitId);
    return NextResponse.json(visit);
  } catch (e) {
    return errorResponse(e);
  }
}
