import React from "react";
import { Users, Mail, FileText } from "lucide-react";

interface StatsProps {
  totalUser: number;
  totalSubs: number;
  totalBerita: number;
}

export default function StatsGrid({ totalUser, totalSubs, totalBerita }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Kartu 1: User */}
      <div className="bg-card border border-border rounded-md p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Pengguna</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{totalUser}</h3>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          <Users size={20} />
        </div>
      </div>

      {/* Kartu 2: Subscriber */}
      <div className="bg-card border border-border rounded-md p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Subscriber Newsletter</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{totalSubs}</h3>
          <p className="text-xs text-green-600 mt-1">Briefing Pagi Aktif</p>
        </div>
        <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center text-green-700">
          <Mail size={20} />
        </div>
      </div>

      {/* Kartu 3: Berita */}
      <div className="bg-card border border-border rounded-md p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Artikel</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{totalBerita}</h3>
        </div>
        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-700">
          <FileText size={20} />
        </div>
      </div>
    </div>
  );
}