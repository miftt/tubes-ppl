import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  try {
    // 1. Cek Login
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    const userId = (session.user as any).id;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Ambil Password Lama (Hash) dari Database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 3. Bandingkan Password Inputan User vs Hash di DB
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Password lama salah!" }, { status: 400 });
    }

    // 4. Hash Password Baru
    const newHash = await bcrypt.hash(newPassword, 10);

    // 5. Update ke Database
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    return NextResponse.json({ message: "Password berhasil diubah" });

  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}