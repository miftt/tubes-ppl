import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
import { UserRole, UserStatus } from "@prisma/client";

async function main() {
  const username = "danewsadmin";
  const email = "admin@danews.com";
  const plainPassword = "Danews@123"; // ganti kalau mau

  console.log("Seeding admin user...");

  const passwordHash = await hashPassword(plainPassword);

  const admin = await prisma.user.upsert({
    where: { email }, // email unique
    update: {
      username,
      passwordHash,
      role: UserRole.Admin,
      status: UserStatus.Aktif,
      fullName: "DANews Admin",
    },
    create: {
      username,
      email,
      passwordHash,
      role: UserRole.Admin,
      status: UserStatus.Aktif,
      fullName: "DANews Admin",
    },
  });

  console.log("Admin siap dipakai:");
  console.log({ username: admin.username, email: admin.email, password: plainPassword });
}

main()
  .catch((e) => {
    console.error("Seed admin gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
