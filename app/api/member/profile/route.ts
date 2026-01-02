import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fullName } = await req.json();
    const rawId = (session.user as any).id;
    const userId = Number(rawId);

    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "ID user tidak valid" }, { status: 400 });
    }

    // Update Nama Lengkap di kolom full_name
    await prisma.user.update({
      where: { id: userId },
      data: { fullName },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}