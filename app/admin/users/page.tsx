"use client";

import React, { useEffect, useState } from "react";
import UserTable from "@/components/dashboard/UserTable";
import DeleteModal from "@/components/ui/DeleteModal"; 
import EditModal from "@/components/ui/EditModal"; 

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE MODAL
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Load data real dari API admin
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Gagal memuat data user");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // LOGIKA HAPUS (real ke DB)
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete user API error:", res.status, text);
        throw new Error("Gagal menghapus user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteId(null);
    }
  };

  // LOGIKA EDIT (real ke DB)
  const saveEdit = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
          status: updatedUser.status,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update user API error:", res.status, text);
        throw new Error("Gagal menyimpan perubahan user");
      }

      const saved: User = await res.json();

      setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setEditUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen User</h1>
        <p className="text-muted-foreground">Kelola data pengguna aplikasi.</p>
      </div>

      <div className="w-full">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data pengguna...</p>
        ) : (
          <UserTable 
            data={users} 
            onDeleteRequest={(id) => setDeleteId(id)} 
            onEditRequest={(id) => setEditUser(users.find((u) => u.id === id) || null)} 
          />
        )}
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
