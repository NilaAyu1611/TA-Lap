"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { formInputClass, formLabelClass, formSelectClass } from "@/components/admin/lapangan/formStyles";
import { formatDate, formatRupiah } from "@/lib/auth";
import { KategoriPengeluaran, PengeluaranItem } from "@/types/laporan";

const kategoriOptions: { value: KategoriPengeluaran; label: string }[] = [
  { value: "operasional", label: "Operasional" },
  { value: "marketing", label: "Marketing" },
  { value: "refund_manual", label: "Refund Manual" },
  { value: "lainnya", label: "Lainnya" },
];

type Props = {
  items: PengeluaranItem[];
  onAdd: (data: {
    kategori: KategoriPengeluaran;
    deskripsi: string;
    jumlah: number;
    tanggal?: string;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function PengeluaranSection({ items, onAdd, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    kategori: "operasional" as KategoriPengeluaran,
    deskripsi: "",
    jumlah: "",
    tanggal: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deskripsi || !form.jumlah) return;
    setLoading(true);
    try {
      await onAdd({
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        jumlah: Number(form.jumlah),
        tanggal: form.tanggal,
      });
      setForm({
        kategori: "operasional",
        deskripsi: "",
        jumlah: "",
        tanggal: new Date().toISOString().slice(0, 10),
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/5">
        <div>
          <h3 className="text-sm font-semibold">Pengeluaran Operasional</h3>
          <p className="text-xs text-gray-500">
            Biaya server, marketing, dll. (bukan payout owner)
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 print:hidden"
        >
          <Plus size={14} />
          Catat Pengeluaran
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="border-b border-gray-100 p-4 dark:border-white/5 print:hidden">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={formLabelClass}>Kategori</label>
              <select
                value={form.kategori}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    kategori: e.target.value as KategoriPengeluaran,
                  }))
                }
                className={formSelectClass}
              >
                {kategoriOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={formLabelClass}>Jumlah (Rp)</label>
              <input
                type="number"
                min="0"
                value={form.jumlah}
                onChange={(e) => setForm((p) => ({ ...p, jumlah: e.target.value }))}
                className={formInputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={formLabelClass}>Deskripsi</label>
              <input
                value={form.deskripsi}
                onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                placeholder="Contoh: Bayar hosting bulan Juni"
                className={formInputClass}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
        </form>
      )}

      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {items.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">Belum ada pengeluaran operasional.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{item.deskripsi}</p>
                <p className="text-xs capitalize text-gray-500">
                  {item.kategori.replace("_", " ")} · {formatDate(item.tanggal)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-600">
                  −{formatRupiah(item.jumlah)}
                </span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 print:hidden"
                  title="Hapus"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
