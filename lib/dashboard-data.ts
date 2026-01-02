import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

// Mengambil data statistik dashboard langsung dari database (tabel users & bookmarks)
export async function getDashboardStats() {
  // 1. Hitung Total User
  const totalUsersCount = await prisma.user.count();
  
  // 2. Hitung User Aktif
  const activeUsersCount = await prisma.user.count({
    where: { status: UserStatus.Aktif }
  });

  // 3. Hitung Total Bookmark (semua berita tersimpan)
  const totalBookmarksCount = await prisma.bookmark.count();

  return {
    totalUsers: totalUsersCount,
    activeUsers: activeUsersCount,
    totalBookmarks: totalBookmarksCount,
    userChartData: [
      { name: 'Total User', value: totalUsersCount },
      { name: 'User Aktif', value: activeUsersCount },
    ],
  };
}
