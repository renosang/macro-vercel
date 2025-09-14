// src/app/api/broadcast/route.ts

import { NextResponse } from "next/server";
import { getBroadcasts, createBroadcast, updateBroadcastStatus, deleteBroadcast } from "@lib/storage/broadcastStorage";

export async function GET() {
  try {
    const broadcasts = getBroadcasts();
    return NextResponse.json(broadcasts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch broadcasts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    const newBroadcast = createBroadcast(message);
    return NextResponse.json(newBroadcast, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { isActive } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    updateBroadcastStatus(id, isActive);
    return NextResponse.json({ message: "Broadcast updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update broadcast" }, { status: 500 });
  }
}

// Đã sửa lỗi tại dòng này
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    deleteBroadcast(id);
    return NextResponse.json({ message: "Broadcast deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete broadcast" }, { status: 500 });
  }
}