"use client";

import { useState } from "react";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ current: "", new: "", confirm: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new !== formData.confirm) return alert("Konfirmasi password tidak cocok!");
    if (formData.new.length < 6) return alert("Password minimal 6 karakter!");

    setIsLoading(true);

    try {
      const res = await fetch("/api/member/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPassword: formData.current,
          newPassword: formData.new 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal ganti password");

      alert("Password berhasil diubah!");
      setFormData({ current: "", new: "", confirm: "" }); // Reset form
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Keamanan & Password</CardTitle>
          <CardDescription>Pastikan menggunakan password yang kuat.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Password Sekarang</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="current" type="password" className="pl-9" value={formData.current} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">Password Baru</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="new" type="password" className="pl-9" value={formData.new} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Konfirmasi Password Baru</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="confirm" type="password" className="pl-9" value={formData.confirm} onChange={handleChange} required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <Button type="submit" variant="destructive" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}