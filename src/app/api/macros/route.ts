import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/storage/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const categoryId = new URL(req.url).searchParams.get("categoryId");
  const data = categoryId ? db.listMacrosByCategory(categoryId) : db.getMacros();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { categoryId, title, content } = body ?? {};
  if (!categoryId || !title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const created = db.createMacro({ categoryId, title, content });
  return NextResponse.json(created);
}

export async function PUT(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const patch = await req.json();
  try {
    const updated = db.updateMacro(id, patch);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    db.deleteMacro(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}