import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createAlert, listAlerts } from "@/lib/alerts";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = await listAlerts(getDb());
  return NextResponse.json(alerts);
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
