import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function EditModal({ isOpen, userData, onClose, onSave }: any) {
  const [formData, setFormData] = useState(userData || {});

  useEffect(() => {
    setFormData(userData || {});
  }, [userData]);

  if (!isOpen) return null;

  return (
    // FIX: z-[9999], bg-black/60
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-lg text-gray-800">Edit Pengguna</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-white">
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Username</label>
            <input 
              type="text" 
              value={formData.username || ''} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Role</label>
            <select 
              value={formData.role || 'Member'} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Member">Member</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
            <select 
              value={formData.status || 'Aktif'} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Save size={16} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}