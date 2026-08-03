import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { resolveComplaint } from "@/lib/complaints";
import { errorResponse } from "@/lib/api";
import { DomainError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const complaintId = Number(id);
    if (!Number.isInteger(complaintId)) {
      throw new DomainError("id de denuncia inválido", "invalid");
    }
    const complaint = await resolveComplaint(getDb(), complaintId);
    return NextResponse.json(complaint);
  } catch (e) {
    return errorResponse(e);
  }
}
