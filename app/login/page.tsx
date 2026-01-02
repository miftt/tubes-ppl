"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      const callbackUrl = searchParams.get("callbackUrl");
      // Decode URL if it's encoded
      const decodedCallbackUrl = callbackUrl ? decodeURIComponent(callbackUrl) : null;
      const role = session?.user?.role;
      
      if (role === "Admin" || role === "Editor") {
        // Admin/Editor: use callbackUrl if it's an admin path, otherwise dashboard
        if (decodedCallbackUrl && decodedCallbackUrl.includes("/admin")) {
          window.location.href = decodedCallbackUrl;
        } else {
          window.location.href = "/admin/dashboard";
        }
      } else {
        // Member should go to home, not admin pages
        window.location.href = "/";
      }
    }
  }, [status, session, searchParams]);

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Registrasi berhasil! Silakan login dengan akun Anda.");
    }
  }, [searchParams]);

  // Show loading while checking session
  if (status === "loading") {
    return <LoginFormFallback />;
  }

  // Don't render login form if already authenticated (will redirect)
  if (status === "authenticated") {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-muted-foreground">Mengalihkan...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get callbackUrl from query params
      const callbackUrl = searchParams.get("callbackUrl");
      
      // Sign in without redirect first
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Wait a bit for session to be updated
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Fetch updated session to get user role
        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await sessionRes.json();
        const role = session?.user?.role;

        // Determine redirect URL based on role and callbackUrl
        let redirectUrl = "/";
        
        // Decode callbackUrl if it's URL encoded
        const decodedCallbackUrl = callbackUrl ? decodeURIComponent(callbackUrl) : null;
        
        if (role === "Admin" || role === "Editor") {
          // Admin/Editor: use callbackUrl if it's an admin path, otherwise dashboard
          if (decodedCallbackUrl && decodedCallbackUrl.includes("/admin")) {
            redirectUrl = decodedCallbackUrl;
          } else {
            redirectUrl = "/admin/dashboard";
          }
        } else {
          // Member should go to home, not admin pages
          redirectUrl = "/";
        }

        // Use window.location for full page reload to ensure session is properly set
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
          <span className="text-2xl font-serif font-bold text-primary-foreground">
            DA
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold mb-2">DAnews Panel</h1>
        <p className="text-sm text-muted-foreground">
          Masuk untuk mendapatkan berita terbaru
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-card border border-border rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-sm text-green-600">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              Username atau Email
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Masukkan username atau email"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Kembali ke{" "}
            <Link
              href="/"
              className="text-primary hover:underline font-medium"
            >
              halaman utama
            </Link>
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Digital Archives News Network
        </p>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
          <span className="text-2xl font-serif font-bold text-primary-foreground">
            DA
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold mb-2">DAnews Panel</h1>
        <p className="text-sm text-muted-foreground">
          Masuk untuk mendapatkan berita terbaru
        </p>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-primary/30 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
