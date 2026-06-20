import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { listSpots, assignResidentSpot, parkingSummary } from "@/lib/parking";
import { assignSpotInput } from "@/lib/schemas";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const [spots, summary] = await Promise.all([
    listSpots(db),
    parkingSummary(db),
  ]);
  return NextResponse.json({ spots, summary });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = assignSpotInput.parse(await req.json());
    const spot = await assignResidentSpot(getDb(), body.spot_label, body.unidad);
    return NextResponse.json(spot);
  } catch (e) {
    return errorResponse(e);
  }
}
