import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query<{
      id: number;
      email: string;
      status: string;
      subscribed_at: Date | string | null;
    }>(
      "SELECT id, email, status, subscribed_at FROM subscribers ORDER BY subscribed_at DESC"
    );

    const data = rows.map((row) => ({
      id: row.id,
      email: row.email,
      status: row.status,
      joined:
        row.subscribed_at instanceof Date
          ? row.subscribed_at.toISOString().slice(0, 10)
          : (row.subscribed_at ?? "").toString().slice(0, 10),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching subscribers for admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data subscribers" },
      { status: 500 }
    );
  }
}
