import { query } from "@/lib/db";

// Mengambil data statistik dashboard langsung dari database (tabel users & subscribers)
export async function getDashboardStats() {
  // 1. Hitung Total User
  const totalUsers: any = await query("SELECT COUNT(*) as count FROM users");
  
  // 2. Hitung User Aktif
  const activeUsers: any = await query("SELECT COUNT(*) as count FROM users WHERE status = 'Aktif'");

  // 3. Hitung Total Subscriber
  const totalSubscribers: any = await query("SELECT COUNT(*) as count FROM subscribers");

  // 4. Hitung Subscriber Aktif
  const activeSubscribers: any = await query("SELECT COUNT(*) as count FROM subscribers WHERE status = 'Aktif'");

  const totalUsersCount = Number(totalUsers[0]?.count ?? 0) || 0;
  const activeUsersCount = Number(activeUsers[0]?.count ?? 0) || 0;
  const totalSubscribersCount = Number(totalSubscribers[0]?.count ?? 0) || 0;
  const activeSubscribersCount = Number(activeSubscribers[0]?.count ?? 0) || 0;

  return {
    totalUsers: totalUsersCount,
    activeUsers: activeUsersCount,
    totalSubscribers: totalSubscribersCount,
    activeSubscribers: activeSubscribersCount,
    userChartData: [
      { name: 'Total User', value: totalUsersCount },
      { name: 'User Aktif', value: activeUsersCount },
    ],
    subscriberChartData: [
      { name: 'Total Subscriber', value: totalSubscribersCount },
      { name: 'Subscriber Aktif', value: activeSubscribersCount },
    ],
  };
}
