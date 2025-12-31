// ============================================
// Authentication Helper Functions
// ============================================

import bcrypt from 'bcrypt';
import { queryOne, query } from './db';

// Interface untuk user dari database
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'Admin' | 'Editor' | 'Member';
  status: 'Aktif' | 'Nonaktif';
  full_name?: string;
  avatar?: string;
}

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
): Promise<User | null> {
  const user = await queryOne<User>(
    `SELECT id, username, email, password_hash, role, status, full_name, avatar 
     FROM users 
     WHERE (username = ? OR email = ?) AND status = 'Aktif'`,
    [identifier, identifier]
  );
  return user;
}

// Cari user berdasarkan ID
export async function getUserById(id: number): Promise<User | null> {
  const user = await queryOne<User>(
    `SELECT id, username, email, password_hash, role, status, full_name, avatar 
     FROM users 
     WHERE id = ? AND status = 'Aktif'`,
    [id]
  );
  return user;
}

// Update last login
export async function updateLastLogin(userId: number): Promise<void> {
  await query(
    `UPDATE users SET last_login = NOW() WHERE id = ?`,
    [userId]
  );
}

