// ============================================
// Next.js Proxy untuk Proteksi Route
// ============================================

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const userRole = (token as any)?.role;

    // Jika mengakses route admin
    if (isAdminRoute) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // Hanya Admin dan Editor yang bisa akses admin route
      if (userRole !== "Admin" && userRole !== "Editor") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Jika sudah login dan mengakses halaman login/register
    if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && token) {
      // Redirect berdasarkan role
      if (userRole === "Admin" || userRole === "Editor") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        
        // Jika mengakses route admin, harus ada token dan role Admin/Editor
        if (isAdminRoute) {
          if (!token) return false;
          const role = (token as any)?.role;
          return role === "Admin" || role === "Editor";
        }
        
        // Route lain tidak perlu auth
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
  ],
};

