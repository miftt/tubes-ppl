import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// Import dari folder [...nextauth] yang benar
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { query, queryOne } from "@/lib/db"; 
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
    // Sesuaikan nama tabel 'users' dan kolom 'password_hash' dengan DB kamu
    const user = await queryOne<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = ?", 
      [userId]
    );

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 3. Bandingkan Password Inputan User vs Hash di DB
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: "Password lama salah!" }, { status: 400 });
    }

    // 4. Hash Password Baru
    const newHash = await bcrypt.hash(newPassword, 10);

    // 5. Update ke Database
    await query(
      "UPDATE users SET password_hash = ? WHERE id = ?", 
      [newHash, userId]
    );

    return NextResponse.json({ message: "Password berhasil diubah" });

  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}