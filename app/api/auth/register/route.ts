// ============================================
// API Route untuk Register User
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { query, queryOne, getDatabaseConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, fullName, password, subscribeNewsletter } = body;

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, dan password harus diisi' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    const existingUsername = await queryOne(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 409 }
      );
    }

    // Cek apakah email sudah ada
    const existingEmail = await queryOne(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password menggunakan bcrypt (salt rounds: 10)
    const passwordHash = await hashPassword(password);

    // Insert user baru dengan role Member
    const connection = await getDatabaseConnection();
    try {
      const [result]: any = await connection.execute(
        `INSERT INTO users (username, email, password_hash, full_name, role, status) 
         VALUES (?, ?, ?, ?, 'Member', 'Aktif')`,
        [username, email, passwordHash, fullName || null]
      );
      const userId = result.insertId;

      // Jika user memilih subscribe newsletter, tambahkan ke tabel subscribers
      if (subscribeNewsletter) {
        try {
          // Cek apakah email sudah ada di subscribers
          const existingSubscriber = await queryOne(
            `SELECT id FROM subscribers WHERE email = ?`,
            [email]
          );

          if (!existingSubscriber) {
            // Insert ke subscribers
            await query(
              `INSERT INTO subscribers (email, status, is_verified) 
               VALUES (?, 'Aktif', TRUE)`,
              [email]
            );
          } else {
            // Update status jika sudah ada tapi nonaktif
            await query(
              `UPDATE subscribers SET status = 'Aktif', is_verified = TRUE WHERE email = ?`,
              [email]
            );
          }
        } catch (subscriberError) {
          // Log error tapi tidak gagalkan registrasi
          console.error('Error adding subscriber:', subscriberError);
        }
      }

      connection.release();

      return NextResponse.json(
        {
          message: 'Registrasi berhasil',
          user: {
            id: userId,
            username,
            email,
          },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      connection.release();
      throw dbError;
    }
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}

