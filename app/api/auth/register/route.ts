// ============================================
// API Route untuk Register User
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 409 }
      );
    }

    // Cek apakah email sudah ada
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password menggunakan bcrypt (salt rounds: 10)
    const passwordHash = await hashPassword(password);

    // Insert user baru dengan role Member
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName: fullName || null,
        role: 'Member',
        status: 'Aktif'
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    // Jika user memilih subscribe newsletter, tambahkan ke tabel subscribers
    if (subscribeNewsletter) {
      try {
        await prisma.subscriber.upsert({
          where: { email },
          update: {
            status: 'Aktif',
            isVerified: true
          },
          create: {
            email,
            status: 'Aktif',
            isVerified: true
          }
        });
      } catch (subscriberError) {
        // Log error tapi tidak gagalkan registrasi
        console.error('Error adding subscriber:', subscriberError);
      }
    }

    return NextResponse.json(
      {
        message: 'Registrasi berhasil',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
