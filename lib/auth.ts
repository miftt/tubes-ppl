// ============================================
// Authentication Helper Functions
// ============================================

import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { User, UserRole, UserStatus } from '@prisma/client';

// Type untuk user dengan password hash (untuk auth)
export type UserWithPassword = Pick<User, 'id' | 'username' | 'email' | 'passwordHash' | 'role' | 'status' | 'fullName' | 'avatar'>;

// Hash password menggunakan bcrypt dengan salt rounds 10
// Ini menghasilkan hash yang aman seperti: $2b$10$...
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Cost factor untuk bcrypt (semakin tinggi semakin aman tapi lebih lambat)
  return await bcrypt.hash(password, saltRounds);
}

// Verify password dengan hash dari database
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Cari user berdasarkan username atau email
export async function getUserByUsernameOrEmail(
  identifier: string
): Promise<UserWithPassword | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier }
      ],
      status: UserStatus.Aktif
    },
    select: {
      id: true,
      username: true,
      email: true,
      passwordHash: true,
      role: true,
      status: true,
      fullName: true,
      avatar: true
    }
  });
  
  return user;
}

// Cari user berdasarkan ID
export async function getUserById(id: number): Promise<UserWithPassword | null> {
  const user = await prisma.user.findFirst({
    where: {
      id,
      status: UserStatus.Aktif
    },
    select: {
      id: true,
      username: true,
      email: true,
      passwordHash: true,
      role: true,
      status: true,
      fullName: true,
      avatar: true
    }
  });
  
  return user;
}

// Update last login
export async function updateLastLogin(userId: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() }
  });
}

