import { getDashboardStats } from "@/lib/dashboard-data";
import { DashboardChart } from "@/components/admin/DashboardChart";
import { DownloadReport } from "@/components/admin/DownloadReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Mail } from "lucide-react";

export const metadata = { title: "Dashboard Admin | DANews" };

export default async function AdminDashboard() {
  // Ambil data real dari database (tabel users & subscribers)
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Dashboard & Tombol PDF */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Ringkasan aktivitas aplikasi DANews.</p>
        </div>
        <DownloadReport stats={stats} />
      </div>

      {/* Kartu Statistik (Atas) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Kartu 1: Total User */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Semua pengguna terdaftar</p>
          </CardContent>
        </Card>

        {/* Kartu 2: User Aktif */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Pengguna status 'Aktif'</p>
          </CardContent>
        </Card>

        {/* Kartu 3: Subscriber Aktif */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriber Aktif</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Email yang masih berlangganan</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik (Bawah) */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardChart 
          userData={stats.userChartData} 
          subscriberData={stats.subscriberChartData} 
        />
      </div>
    </div>
  );
}
