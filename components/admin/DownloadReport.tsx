"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function DownloadReport({ stats }: { stats: any }) {
  const [open, setOpen] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();

    // 1. Judul PDF
    doc.setFontSize(20);
    doc.text("Laporan Admin DANews", 14, 22);
    
    // 2. Tanggal Cetak
    doc.setFontSize(11);
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, 30);

    // 3. Isi Tabel Data
    const tableData = [
      ["Parameter", "Jumlah"],
      ["Total Pengguna Terdaftar", String(stats.totalUsers ?? 0)],
      ["Pengguna Status Aktif", String(stats.activeUsers ?? 0)],
      ["Total Subscriber", String(stats.totalSubscribers ?? 0)],
      ["Subscriber Aktif", String(stats.activeSubscribers ?? 0)],
    ];

    // 4. Generate Tabel
    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 40,
    });

    // 5. Download File
    doc.save("laporan-dashboard.pdf");
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="bg-blue-600 hover:bg-blue-700" 
        type="button"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Lihat & Unduh Laporan
      </Button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Preview Laporan</p>
                <h3 className="text-base font-semibold text-foreground">Ringkasan Dashboard</h3>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Tutup
              </button>
            </div>

            <div className="px-6 py-4 space-y-3 text-sm">
              <p className="text-muted-foreground">
                Berikut adalah data yang akan dimasukkan ke dalam file PDF laporan dashboard.
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Parameter</th>
                      <th className="px-4 py-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">Total Pengguna Terdaftar</td>
                      <td className="px-4 py-2 text-right font-semibold">{stats.totalUsers ?? 0}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Pengguna Status Aktif</td>
                      <td className="px-4 py-2 text-right font-semibold">{stats.activeUsers ?? 0}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Total Subscriber</td>
                      <td className="px-4 py-2 text-right font-semibold">{stats.totalSubscribers ?? 0}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Subscriber Aktif</td>
                      <td className="px-4 py-2 text-right font-semibold">{stats.activeSubscribers ?? 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setOpen(false)} 
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <Button 
                type="button" 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  generatePDF();
                  setOpen(false);
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Unduh PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
