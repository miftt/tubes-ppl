import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data users" },
      { status: 500 }
    );
  }
}
