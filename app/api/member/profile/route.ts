import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db"; 

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fullName } = await req.json();
    const userId = (session.user as any).id;

    // Update Nama
    await query("UPDATE users SET full_name = ? WHERE id = ?", [fullName, userId]);

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}