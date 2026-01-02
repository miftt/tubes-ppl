import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SubscriberData } from "@/types/subscriber";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true
      }
    });

    const data = subscribers.map((row: SubscriberData) => ({
      id: row.id,
      email: row.email,
      status: row.status,
      joined: row.subscribedAt ? row.subscribedAt.toISOString().slice(0, 10) : "",
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
