"use client";

import { useState } from "react";
import { Lock, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ current: "", new: "", confirm: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new !== formData.confirm) return alert("Konfirmasi password tidak cocok!");
    if (formData.new.length < 6) return alert("Password minimal 6 karakter!");

    setIsLoading(true);

    try {
      const res = await fetch("/api/member/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPassword: formData.current,
          newPassword: formData.new 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal ganti password");

      setShowSuccess(true);
      setFormData({ current: "", new: "", confirm: "" }); // Reset form
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Password berhasil diubah
            </DialogTitle>
            <DialogDescription>
              Password baru kamu sudah tersimpan. Gunakan password ini saat login berikutnya.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
