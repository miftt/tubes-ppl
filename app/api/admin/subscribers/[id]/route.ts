import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Secara bisnis: tandai sebagai Unsubscribed + isi unsubscribed_at
    await prisma.subscriber.update({
      where: { id },
      data: {
        status: 'Unsubscribed',
        unsubscribedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsubscribing subscriber:", error);
    return NextResponse.json(
      { error: "Gagal menghapus / unsubscribe subscriber" },
      { status: 500 }
    );
  }
}
