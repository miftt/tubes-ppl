"use client";

import React, { useState } from "react";
import SubscriberTable from "@/components/dashboard/SubscriberTable";
import DeleteModal from "@/components/ui/DeleteModal"; 

export default function SubscribersPage() {
  // DATA SUBSCRIBER DIPINDAH KESINI
  const [subscribers, setSubscribers] = useState([
    { id: 1, email: "pembaca_setia@gmail.com", joined: "2024-01-10", status: "Aktif" },
    { id: 2, email: "info_bisnis@yahoo.com", joined: "2024-01-12", status: "Aktif" },
  ]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteId) setSubscribers(subscribers.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscriber DAnews</h1>
        <p className="text-muted-foreground">Daftar email yang menerima berita harian.</p>
      </div>

      <div className="w-full">
         <SubscriberTable 
           data={subscribers} 
           onDelete={(id) => setDeleteId(id)} 
         />
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