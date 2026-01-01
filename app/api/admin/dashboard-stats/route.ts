import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

type RawDashboardRow = {
  total_users: number | string | null;
  total_subscribers: number | string | null;
  total_articles: number | string | null;
  articles_today: number | string | null;
};

export async function GET() {
  try {
    const row = await queryOne<RawDashboardRow>(
      "SELECT * FROM v_dashboard_stats"
    );

    const body = {
      total_users: Number(row?.total_users ?? 0) || 0,
      total_subscribers: Number(row?.total_subscribers ?? 0) || 0,
      total_articles: Number(row?.total_articles ?? 0) || 0,
      articles_today: Number(row?.articles_today ?? 0) || 0,
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
