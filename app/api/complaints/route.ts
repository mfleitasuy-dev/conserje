import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createComplaint, listComplaints } from "@/lib/complaints";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const complaints = await listComplaints(getDb());
  return NextResponse.json(complaints);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const complaint = await createComplaint(getDb(), body);
    return NextResponse.json(complaint, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
