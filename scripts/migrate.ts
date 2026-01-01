// ============================================
// Database Migration Script
// Jalankan dengan: npx tsx scripts/migrate.ts
// ============================================

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Konfigurasi database dari environment
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'danews_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // Penting untuk menjalankan multiple SQL statements
};

async function runMigrations() {
    console.log('🚀 Memulai migrasi database...\n');

    let connection: mysql.Connection | null = null;

    try {
        // Koneksi ke database
        console.log(`📡 Menghubungkan ke database ${config.database}@${config.host}:${config.port}...`);
        connection = await mysql.createConnection(config);
        console.log('✅ Terhubung ke database!\n');

        // Baca semua file migration
        const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');

        if (!fs.existsSync(migrationsDir)) {
            console.log('⚠️ Folder migrations tidak ditemukan. Tidak ada migration yang dijalankan.');
            return;
        }

        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Urutkan berdasarkan nama file (001_, 002_, dst.)

        if (migrationFiles.length === 0) {
            console.log('⚠️ Tidak ada file migration (.sql) yang ditemukan.');
            return;
        }

        console.log(`📂 Ditemukan ${migrationFiles.length} file migration:\n`);

        // Jalankan setiap migration
        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            console.log(`⏳ Menjalankan: ${file}...`);

            try {
                await connection.query(sql);
                console.log(`✅ ${file} - Berhasil!\n`);
            } catch (err: any) {
                // Jika error karena tabel sudah ada, lanjutkan
                if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                    console.log(`ℹ️ ${file} - Tabel sudah ada, dilewati.\n`);
                } else {
                    throw err;
                }
            }
        }

        console.log('🎉 Semua migrasi selesai dijalankan!');

    } catch (error: any) {
        console.error('\n❌ Error saat menjalankan migrasi:');
        console.error(error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n📡 Koneksi database ditutup.');
        }
    }
}

// Jalankan migration
runMigrations();
