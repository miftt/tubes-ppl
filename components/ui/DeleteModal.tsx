import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    // FIX: inset-0 (bukan w-screen), z-[9999], bg-white/90 (Putih Blur)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Merah */}
        <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
          <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>

        {/* Tombol */}
        <div className="p-4 flex gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-md transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}