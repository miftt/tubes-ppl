"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

interface BiodataFormProps {
  user: { name?: string | null; email?: string | null };
}

export function BiodataForm({ user }: BiodataFormProps) {
  const router = useRouter();
  const { update } = useSession(); // Biar session di navbar langsung berubah
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name }),
      });

      if (!res.ok) throw new Error("Gagal update");

      // Update session client side tanpa reload
      await update({ name: name });
      
      alert("Biodata berhasil disimpan!");
      router.refresh();
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Biodata Diri</CardTitle>
          <CardDescription>Atur informasi publik akun Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={user.email || ""} className="pl-9 bg-muted" disabled />
            </div>
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t pt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Biodata
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}