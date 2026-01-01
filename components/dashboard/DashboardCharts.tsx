"use client";

import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip } from "recharts";
import { FileDown } from "lucide-react";

interface DashboardStats {
  total_users: number;
  total_subscribers: number;
  total_articles: number;
  articles_today: number;
}

interface DashboardChartsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export default function DashboardCharts({ stats, loading }: DashboardChartsProps) {
  const chartData = [
    {
      label: "User Aktif",
      value: stats.total_users,
    },
    {
      label: "Subscriber Aktif",
      value: stats.total_subscribers,
    },
    {
      label: "Artikel Terbit",
      value: stats.total_articles,
    },
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <section className="space-y-4" aria-label="Grafik statistik dashboard">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Grafik Statistik</h2>
          <p className="text-sm text-muted-foreground">
            Data diambil langsung dari database (view <code>v_dashboard_stats</code>).
          </p>
        </div>

        <Button onClick={handlePrint} size="sm" className="shrink-0" type="button">
          <FileDown className="mr-2" size={16} />
          Print PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr] items-start">
        <div className="bg-card border border-border rounded-md p-4 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
              Memuat grafik...
            </div>
          ) : (
            <ChartContainer config={{}} className="w-full h-[260px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  fill="#2563eb"
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-md p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Ringkasan Hari Ini</h3>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">User Aktif</span>
              <span className="font-semibold text-foreground">
                {stats.total_users.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subscriber Aktif</span>
              <span className="font-semibold text-foreground">
                {stats.total_subscribers.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Artikel Terbit</span>
              <span className="font-semibold text-foreground">
                {stats.total_articles.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
              <span className="text-muted-foreground">Artikel dipublish hari ini</span>
              <span className="font-semibold text-foreground">
                {stats.articles_today.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Gunakan tombol <span className="font-semibold">Print PDF</span> di atas
            untuk menyimpan tampilan dashboard sebagai file PDF melalui fitur
            print di browser.
          </p>
        </div>
      </div>
    </section>
  );
}
