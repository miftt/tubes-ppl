// ============================================
// Database Connection Helper
// Untuk koneksi MySQL dari Next.js
// ============================================

import mysql from 'mysql2/promise';

// Interface untuk konfigurasi database
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Fungsi untuk mendapatkan konfigurasi database dari environment variables
function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'danews_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };
}

// Pool connection untuk efisiensi
let pool: mysql.Pool | null = null;

// Fungsi untuk mendapatkan database pool
export function getDatabasePool(): mysql.Pool {
  if (!pool) {
    const config = getDatabaseConfig();
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

// Fungsi untuk mendapatkan koneksi database
export async function getDatabaseConnection(): Promise<mysql.PoolConnection> {
  const pool = getDatabasePool();
  return await pool.getConnection();
}

// Fungsi helper untuk query
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const connection = await getDatabaseConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

// Fungsi helper untuk query single row
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Fungsi untuk menutup pool (untuk cleanup)
export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Export types
export type { DatabaseConfig };

