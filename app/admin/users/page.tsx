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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // STATE MODAL
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Load data real dari API admin
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Admin /api/admin/users error:", res.status, text);
          throw new Error("Gagal memuat data user");
        }
        const data: User[] = await res.json();
        setUsers(data);
        setCurrentPage(1);
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
      setCurrentPage(1);
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

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

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
          <>
            <UserTable 
              data={paginatedUsers} 
              onDeleteRequest={(id) => setDeleteId(id)} 
              onEditRequest={(id) => setEditUser(users.find((u) => u.id === id) || null)} 
            />

            {/* Pagination */}
            {users.length > pageSize && (
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + pageSize, users.length)} dari {users.length} pengguna
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-7 h-7 px-2 rounded border text-[11px] font-semibold transition-colors ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
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
