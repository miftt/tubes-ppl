// ============================================
// NextAuth API Route Handler
// ============================================

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByUsernameOrEmail, verifyPassword, getUserById, updateLastLogin } from '@/lib/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username dan password harus diisi');
        }

        try {
          // Cari user berdasarkan username atau email
          const user = await getUserByUsernameOrEmail(credentials.username);

          if (!user) {
            throw new Error('Username atau password salah');
          }

          // Verify password
          const isPasswordValid = await verifyPassword(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            throw new Error('Username atau password salah');
          }

          // Update last login
          await updateLastLogin(user.id);

          // Return user object untuk session
          return {
            id: user.id.toString(),
            name: user.full_name || user.username,
            email: user.email,
            role: user.role,
            username: user.username,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Terjadi kesalahan saat login');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

