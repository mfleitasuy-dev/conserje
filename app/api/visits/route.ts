import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { registerVisit, listVisitsToday } from "@/lib/visits";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const visits = await listVisitsToday(getDb());
  return NextResponse.json(visits);
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
