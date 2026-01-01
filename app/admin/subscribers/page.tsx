"use client";

import React, { useEffect, useState } from "react";
import SubscriberTable from "@/components/dashboard/SubscriberTable";
import DeleteModal from "@/components/ui/DeleteModal"; 

type Subscriber = {
  id: number;
  email: string;
  joined: string;
  status: string;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Load data real dari API admin
  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const res = await fetch("/api/admin/subscribers");
        if (!res.ok) throw new Error("Gagal memuat data subscriber");
        const data: Subscriber[] = await res.json();
        setSubscribers(data);
      } catch (error) {
        console.error("Failed to load subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscribers();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/subscribers/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus subscriber");

      // Di UI kita hapus saja dari list
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscriber DAnews</h1>
        <p className="text-muted-foreground">Daftar email yang menerima berita harian.</p>
      </div>

      <div className="w-full">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data subscriber...</p>
        ) : (
          <SubscriberTable 
            data={subscribers} 
            onDelete={(id) => setDeleteId(id)} 
          />
        )}
      </div>

      <DeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Subscriber?"
        message="Email ini tidak akan menerima berita lagi."
      />
    </div>
  );
}
