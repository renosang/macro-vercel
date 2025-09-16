// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import { findUserByUsername } from "@lib/storage/userStorage";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ success: false, message: "Missing username or password" }, { status: 400 });
  }

  const user = findUserByUsername(username);

  if (user && user.password === password) {
    return NextResponse.json({ success: true, role: user.role });
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}