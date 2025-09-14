// src/app/api/users/route.ts

import { NextResponse } from "next/server";
import { createUser, deleteUser, getUsers, updateUser, Role } from "@lib/storage/userStorage";

// Middleware to check for admin privileges (for a more secure system)
// You may not have this implemented yet, so we'll skip it for now.
// const authorizeAdmin = async (request: Request) => {
//   // ... logic
//   return true;
// };

export async function GET(request: Request) {
  try {
    const users = getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;
    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const newUser = createUser({ username, password, role });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng mới:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { role, password } = body; // Cập nhật để hỗ trợ đổi mật khẩu
    
    if (!id || (!role && !password)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const updatePayload: Partial<User> = {};
    if (role) {
      updatePayload.role = role;
    }
    if (password) {
      updatePayload.password = password;
    }

    const updatedUser = updateUser(id, updatePayload);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    deleteUser(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}