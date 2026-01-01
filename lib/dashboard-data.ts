import { prisma } from "@/lib/prisma";
import { UserStatus, SubscriberStatus } from "@prisma/client";

// Mengambil data statistik dashboard langsung dari database (tabel users & subscribers)
export async function getDashboardStats() {
  // 1. Hitung Total User
  const totalUsersCount = await prisma.user.count();
  
  // 2. Hitung User Aktif
  const activeUsersCount = await prisma.user.count({
    where: { status: UserStatus.Aktif }
  });

  // 3. Hitung Total Subscriber
  const totalSubscribersCount = await prisma.subscriber.count();

  // 4. Hitung Subscriber Aktif
  const activeSubscribersCount = await prisma.subscriber.count({
    where: { status: SubscriberStatus.Aktif }
  });

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
