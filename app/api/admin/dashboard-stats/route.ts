import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get counts using Prisma aggregations
    const [totalUsers, totalSubscribers, totalArticles, articlesToday] = await Promise.all([
      prisma.user.count({
        where: { status: 'Aktif' }
      }),
      prisma.subscriber.count({
        where: { status: 'Aktif' }
      }),
      prisma.article.count({
        where: { isPublished: true }
      }),
      prisma.article.count({
        where: {
          isPublished: true,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    const body = {
      total_users: totalUsers,
      total_subscribers: totalSubscribers,
      total_articles: totalArticles,
      articles_today: articlesToday,
    };

    return NextResponse.json(body);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
