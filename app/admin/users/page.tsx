"use client";

import React, { useState } from "react";
import UserTable from "@/components/dashboard/UserTable";
import DeleteModal from "@/components/ui/DeleteModal"; 
import EditModal from "@/components/ui/EditModal"; 

export default function UsersPage() {
  // DATA USER DIPINDAH KESINI
  const [users, setUsers] = useState([
    { id: 1, username: "miftt_admin", email: "miftt@admin.com", role: "Admin", status: "Aktif" },
    { id: 2, username: "zidni_editor", email: "zidni@news.com", role: "Editor", status: "Aktif" },
    { id: 3, username: "budi_user", email: "budi123@gmail.com", role: "Member", status: "Nonaktif" },
  ]);

  // STATE MODAL
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);

  // LOGIKA HAPUS
  const confirmDelete = () => {
    if (deleteId) setUsers(users.filter(u => u.id !== deleteId));
    setDeleteId(null);
  };

  // LOGIKA EDIT
  const saveEdit = (updatedUser: any) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen User</h1>
        <p className="text-muted-foreground">Kelola data pengguna aplikasi.</p>
      </div>

      <div className="w-full">
         <UserTable 
           data={users} 
           onDeleteRequest={(id) => setDeleteId(id)} 
           onEditRequest={(id) => setEditUser(users.find(u => u.id === id))} 
         />
      </div>

      {/* MODAL COMPONENTS */}
      <DeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Pengguna?"
        message="User yang dihapus tidak bisa login kembali."
      />

      <EditModal 
        isOpen={!!editUser}
        userData={editUser}
        onClose={() => setEditUser(null)}
        onSave={saveEdit}
      />
    </div>
  );
}