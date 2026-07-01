"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
  formTextareaClass,
} from "@/components/admin/lapangan/formStyles";
import { formatRupiah } from "@/lib/auth";
import { submitSetoranTunaiOwner } from "@/services/transaksi.service";
import {
  OwnerKewajibanSetoranMonth,
  SetoranTujuanBayar,
} from "@/types/setoranTunai";

type Props = {
  open: boolean;
  row: OwnerKewajibanSetoranMonth;
  tujuan: SetoranTujuanBayar;
  onClose: () => void;
  onSuccess: () => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OwnerSetoranSubmitModal({
  open,
  row,
  tujuan,
  onClose,
  onSuccess,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [metode, setMetode] = useState<"transfer" | "ewallet">("transfer");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [catatan, setCatatan] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Bukti harus berupa gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran maksimal 2 MB");
      return;
    }
    setError("");
    setFileName(file.name);
    setPreview(await readFileAsDataUrl(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) {
      setError("Upload bukti transfer wajib");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitSetoranTunaiOwner(row.tahun, row.bulan, {
        metode,
        tanggal_bayar: new Date(tanggal).toISOString(),
        catatan_owner: catatan || undefined,
        bukti_base64: preview,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengirim pengajuan setoran";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-gray-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Ajukan Setoran
            </p>
            <h2 className="text-lg font-semibold">{row.label}</h2>
            <p className="text-sm text-gray-500">
              Jumlah: {formatRupiah(row.komisi_belum_setor)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="rounded-xl border border-cyan-200/80 bg-cyan-50/50 p-4 text-sm dark:border-cyan-500/20 dark:bg-cyan-500/10">
            <p className="font-semibold text-cyan-900 dark:text-cyan-100">
              Transfer ke rekening platform
            </p>
            {tujuan.bank_account_number ? (
              <div className="mt-2 space-y-1 text-cyan-800 dark:text-cyan-100/90">
                <p>
                  <strong>Bank:</strong> {tujuan.bank_name}
                </p>
                <p>
                  <strong>No. Rekening:</strong> {tujuan.bank_account_number}
                </p>
                <p>
                  <strong>Atas Nama:</strong> {tujuan.bank_account_holder}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-amber-700 dark:text-amber-300">
                Rekening platform belum diatur admin. Hubungi{" "}
                {tujuan.app_phone || tujuan.app_email || "admin TA-LAP"}.
              </p>
            )}
            {tujuan.ewallet_note && (
              <p className="mt-2 text-xs">
                <strong>E-wallet:</strong> {tujuan.ewallet_note}
              </p>
            )}
          </div>

          <div>
            <label className={formLabelClass}>Metode Setor</label>
            <select
              value={metode}
              onChange={(e) =>
                setMetode(e.target.value as "transfer" | "ewallet")
              }
              className={formSelectClass}
            >
              <option value="transfer">Transfer Bank</option>
              <option value="ewallet">E-Wallet (ke rekening platform)</option>
            </select>
          </div>

          <div>
            <label className={formLabelClass}>Tanggal Bayar</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={formInputClass}
              required
            />
          </div>

          <div>
            <label className={formLabelClass}>Bukti Transfer</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600 hover:border-amber-300 dark:border-white/20"
            >
              <Upload size={18} />
              {fileName || "Pilih screenshot bukti transfer"}
            </button>
            {preview && (
              <img
                src={preview}
                alt="Preview bukti"
                className="mt-2 max-h-40 rounded-lg border object-contain"
              />
            )}
          </div>

          <div>
            <label className={formLabelClass}>Catatan (opsional)</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={2}
              placeholder="Contoh: TF dari BCA a/n Budi"
              className={formTextareaClass}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Kirim ke Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
