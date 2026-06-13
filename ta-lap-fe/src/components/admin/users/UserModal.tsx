"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { User, UserFormData, UserStatus } from "@/types/user";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: User | null;
};

const defaultForm: UserFormData = {
  name: "",
  email: "",
  password: "",
  phone: "",
  city: "",
  status: "active",
};

export default function UserModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState<UserFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        password: "",
        phone: initialData.phone || "",
        city: initialData.city || "",
        status: initialData.status,
      });
    } else {
      setForm(defaultForm);
    }
    setError("");
  }, [open, mode, initialData]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Nama dan email wajib diisi");
      return;
    }

    if (mode === "create" && !form.password?.trim()) {
      setError("Password wajib diisi untuk user baru");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan data user";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-[28px] border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-500">
              {mode === "create" ? "Tambah User" : "Edit User"}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {mode === "create" ? "Buat Akun Baru" : "Perbarui Data User"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2 transition hover:border-cyan-500 dark:border-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masukkan nama user"
              className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@email.com"
              className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password {mode === "edit" && "(kosongkan jika tidak diubah)"}
            </label>
            <input
              type="password"
              value={form.password || ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={mode === "create" ? "Minimal 6 karakter" : "••••••••"}
              className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">No. Telepon</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Kota</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Jakarta"
                className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status Akun</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as UserStatus })
              }
              className="w-full rounded-2xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-white/10"
            >
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
              <option value="blocked">Diblokir</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 dark:border-white/10"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "create" ? "Tambah User" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
