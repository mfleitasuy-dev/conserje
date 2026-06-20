import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { rows } = await getDb().query(
    "SELECT id, label FROM units ORDER BY label",
  );
  return NextResponse.json(rows);
}
