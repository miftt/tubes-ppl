"use client";
import React from "react";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas hari ini.</p>
      </div>

      {/* Cuma Statistik aja disini */}
      <StatsGrid 
        totalUser={150} 
        totalSubs={85}
        totalBerita={142} 
      />

      {/* Bisa ditambah grafik atau recent activity simple disini nanti */}
    </div>
  );
}