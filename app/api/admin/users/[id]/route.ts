import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const rawId = body.id ?? params.id;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const { username, role, status } = body;

    await query(
      "UPDATE users SET username = ?, role = ?, status = ? WHERE id = ?",
      [username, role, status, id]
    );

    const updated = await queryOne<{
      id: number;
      username: string;
      email: string;
      role: string;
      status: string;
    }>("SELECT id, username, email, role, status FROM users WHERE id = ?", [id]);

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
    await query("DELETE FROM users WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
