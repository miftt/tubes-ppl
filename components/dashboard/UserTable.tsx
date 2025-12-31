import React from "react";
import { Trash2, Pencil, ShieldCheck } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

interface UserTableProps {
  data: User[];
  onDeleteRequest: (id: number) => void;
  onEditRequest: (id: number) => void;
}

export default function UserTable({ data, onDeleteRequest, onEditRequest }: UserTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" /> Daftar Pengguna
          </h3>
          <p className="text-xs text-gray-500 mt-1">Kelola akses login user.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold">User Info</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="mt-1">
                     <span className={`inline-block w-2 h-2 rounded-full mr-1 ${user.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     <span className="text-[10px] text-gray-400 uppercase">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    user.role === 'Admin' 
                      ? 'bg-purple-50 text-purple-700 border-purple-100' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {/* --- TOMBOL EDIT (SUDAH DIPERBAIKI) --- */}
                    <button 
                      onClick={() => onEditRequest(user.id)}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" 
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* --- TOMBOL HAPUS --- */}
                    <button 
                      onClick={() => onDeleteRequest(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}