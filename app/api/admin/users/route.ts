import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const users = await query<{
      id: number;
      username: string;
      email: string;
      role: string;
      status: string;
    }>(
      "SELECT id, username, email, role, status FROM users ORDER BY id DESC"
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data users" },
      { status: 500 }
    );
  }
}
