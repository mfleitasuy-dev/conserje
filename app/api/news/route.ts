import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createNews, listNews } from "@/lib/news";
import { errorResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const news = await listNews(getDb());
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await createNews(getDb(), body);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
