import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const rawId = body.id ?? params.id;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const { username, role, status } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        username,
        role,
        status
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  let id = Number(params.id);

  // Fallback: baca dari body jika segment tidak terbaca dengan benar
  if (!Number.isFinite(id) || id <= 0) {
    try {
      const body = await req.json().catch(() => null as any);
      if (body && body.id != null) {
        id = Number(body.id);
      }
    } catch {
      // abaikan, akan tetap dianggap invalid di bawah
    }
  }

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
