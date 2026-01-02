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

    // Jika sudah login dan mengakses halaman login/register, redirect
    if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && token) {
      // Get callbackUrl from query params if exists
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      // Decode URL if it's encoded
      const decodedCallbackUrl = callbackUrl ? decodeURIComponent(callbackUrl) : null;
      
      // Redirect berdasarkan role
      if (userRole === "Admin" || userRole === "Editor") {
        // Use callbackUrl if it's an admin path, otherwise go to dashboard
        if (decodedCallbackUrl && decodedCallbackUrl.includes("/admin")) {
          // Validate that decodedCallbackUrl is a valid URL on same origin
          try {
            const url = new URL(decodedCallbackUrl, req.url);
            if (url.origin === new URL(req.url).origin) {
              return NextResponse.redirect(url);
            }
          } catch (e) {
            // Invalid URL, fall through to default
          }
        }
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        // Member should not access admin pages, redirect to home
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

