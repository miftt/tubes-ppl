// ============================================
// NextAuth Type Definitions
// ============================================

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'Admin' | 'Editor' | 'Member';
      username?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: 'Admin' | 'Editor' | 'Member';
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'Admin' | 'Editor' | 'Member';
    username?: string;
  }
}

