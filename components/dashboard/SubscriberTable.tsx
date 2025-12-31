import React from "react";
import { Trash2, Mail } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  joined: string;
  status: string;
}

interface SubscriberTableProps {
  data: Subscriber[];
  onDeleteRequest: (id: number) => void;
}

export default function SubscriberTable({ data, onDelete }: SubscriberTableProps) {
  return (
    <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-muted/20">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Mail size={18} className="text-green-600" /> Pelanggan DAnews
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Email briefing dikirim otomatis oleh sistem tiap 07:00.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Email Pelanggan</th>
              <th className="px-4 py-3 font-medium">Gabung</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {sub.email}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {sub.joined}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    sub.status === 'Aktif' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => onDelete(sub.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-md transition-colors"
                    title="Hapus / Unsubscribe Manual"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}