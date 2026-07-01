"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
  formTextareaClass,
  toTimeInputValue,
} from "@/components/admin/lapangan/formStyles";
import {
  getApiErrorMessage,
  usePesananFormOptions,
} from "@/hooks/usePesananFormOptions";
import { Lapangan } from "@/types/lapangan";
import { Pesanan, PesananFormData, PesananStatus } from "@/types/pesanan";
import { User } from "@/types/user";
import { lookupCustomerByPhone } from "@/services/user.service";
import {
  METODE_PEMBAYARAN_OPTIONS,
  MetodePembayaran,
  STATUS_PEMBAYARAN_OPTIONS,
  StatusPembayaran,
} from "@/lib/pembayaran";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  variant?: "admin" | "owner";
  onClose: () => void;
  onSubmit: (data: PesananFormData) => Promise<void>;
  initialData?: Pesanan | null;
};

type FormState = {
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  lapangan_id: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  catatan: string;
  status: PesananStatus;
  catatPembayaran: boolean;
  metode: MetodePembayaran | "";
  pembayaran_status: StatusPembayaran;
};

const statusOptions: { value: PesananStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "dibayar", label: "Dibayar" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
  { value: "expired", label: "Expired" },
];

const defaultForm: FormState = {
  user_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  lapangan_id: "",
  tanggal: "",
  jam_mulai: "08:00",
  jam_selesai: "10:00",
  catatan: "",
  status: "pending",
  catatPembayaran: false,
  metode: "",
  pembayaran_status: "sukses",
};

const ownerDefaultForm: FormState = {
  user_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  lapangan_id: "",
  tanggal: "",
  jam_mulai: "08:00",
  jam_selesai: "09:00",
  catatan: "Booking walk-in di venue",
  status: "dibayar",
  catatPembayaran: true,
  metode: "cash",
  pembayaran_status: "sukses",
};

import {
  formatDisplayEmail,
  formatDisplayEmailOrDash,
} from "@/lib/customerEmail";

function getDefaultForm(variant: "admin" | "owner"): FormState {
  return variant === "owner" ? { ...ownerDefaultForm } : { ...defaultForm };
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function combineDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

function buildFormFromPesanan(data: Pesanan): FormState {
  const hasPayment = !!data.pembayaran;

  return {
    user_id: String(data.user_id ?? ""),
    customer_name: data.user_name || "",
    customer_phone: data.user_phone || "",
    customer_email: formatDisplayEmail(data.user_email) || "",
    lapangan_id: String(data.lapangan_id ?? ""),
    tanggal: toDateInputValue(data.tanggal_booking),
    jam_mulai: toTimeInputValue(data.jam_mulai) || "08:00",
    jam_selesai: toTimeInputValue(data.jam_selesai) || "10:00",
    catatan: data.catatan || "",
    status: data.status,
    catatPembayaran:
      hasPayment || data.status === "dibayar" || data.status === "selesai",
    metode: (data.pembayaran?.metode as MetodePembayaran) || "",
    pembayaran_status:
      (data.pembayaran?.status as StatusPembayaran) || "sukses",
  };
}

function ensureUserInList(users: User[], data: Pesanan | null | undefined) {
  if (!data?.user_id) return users;

  const userId = String(data.user_id);
  if (users.some((user) => String(user.id) === userId)) return users;

  return [
    {
      id: userId,
      name: data.user_name || "Customer",
      email: formatDisplayEmail(data.user_email) || "",
      phone: data.user_phone,
      city: null,
      avatar: null,
      status: "active",
      joined: "",
      totalBooking: 0,
      totalPayment: 0,
    },
    ...users,
  ];
}

function ensureLapanganInList(
  lapangan: Lapangan[],
  data: Pesanan | null | undefined
) {
  if (!data?.lapangan_id) return lapangan;

  const lapanganId = String(data.lapangan_id);
  if (lapangan.some((item) => String(item.id) === lapanganId)) return lapangan;

  return [
    {
      id: lapanganId,
      nama: data.lapangan_nama || "Lapangan",
      jenis: data.lapangan_jenis,
      jenis_id: 0,
      harga: Number(data.total_harga) || 0,
      status: true,
      gambar: null,
      deskripsi: null,
      alamat: null,
      kota: null,
      kapasitas: null,
      indoor: false,
      jumlah_court: null,
      jam_buka: null,
      jam_tutup: null,
      google_maps_url: null,
      latitude: null,
      longitude: null,
      owner_id: data.owner_id,
      owner_name: data.owner_name,
      owner_email: null,
      totalBooking: 0,
      created_at: "",
    },
    ...lapangan,
  ];
}

export default function PesananModal({
  open,
  mode,
  variant = "admin",
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const isOwner = variant === "owner";
  const {
    users,
    lapangan: lapanganList,
    loading: optionsLoading,
    error: optionsError,
  } = usePesananFormOptions(open, variant);
  const [form, setForm] = useState<FormState>(getDefaultForm(variant));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneLookup, setPhoneLookup] = useState<
    "idle" | "loading" | "found" | "new"
  >("idle");

  const statusChoices = isOwner
    ? statusOptions.filter((opt) => opt.value !== "expired")
    : statusOptions;

  useEffect(() => {
    if (!open || optionsLoading) return;

    if (mode === "edit" && initialData) {
      setForm(buildFormFromPesanan(initialData));
    } else if (mode === "create") {
      const next = getDefaultForm(variant);
      if (isOwner && lapanganList.length === 1) {
        next.lapangan_id = String(lapanganList[0].id);
      }
      setForm(next);
      setPhoneLookup("idle");
    }
    setError("");
  }, [open, mode, initialData?.id, optionsLoading, variant, isOwner, lapanganList]);

  useEffect(() => {
    if (!open || !isOwner || mode !== "create") return;

    const phone = form.customer_phone.replace(/\D/g, "");
    if (phone.length < 10) {
      setPhoneLookup("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setPhoneLookup("loading");
      try {
        const res = await lookupCustomerByPhone(form.customer_phone);
        if (res.data) {
          setForm((prev) => ({
            ...prev,
            user_id: res.data!.id,
            customer_name: res.data!.name || prev.customer_name,
            customer_email: res.data!.email || prev.customer_email,
          }));
          setPhoneLookup("found");
        } else {
          setForm((prev) => ({ ...prev, user_id: "" }));
          setPhoneLookup("new");
        }
      } catch {
        setPhoneLookup("idle");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [form.customer_phone, open, isOwner, mode]);

  useEffect(() => {
    if (optionsError) setError(optionsError);
  }, [optionsError]);

  const userOptions = useMemo(
    () => ensureUserInList(users, initialData),
    [users, initialData]
  );

  const lapanganOptions = useMemo(
    () => ensureLapanganInList(lapanganList, initialData),
    [lapanganList, initialData]
  );

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isOwner && mode === "create") {
      if (
        !form.customer_name.trim() ||
        !form.customer_phone.trim() ||
        !form.lapangan_id ||
        !form.tanggal
      ) {
        setError("Nama, nomor HP, lapangan, dan tanggal wajib diisi");
        return;
      }
    } else if (!form.user_id || !form.lapangan_id || !form.tanggal) {
      setError("Customer, lapangan, dan tanggal wajib diisi");
      return;
    }

    if (form.jam_mulai >= form.jam_selesai) {
      setError("Jam selesai harus lebih besar dari jam mulai");
      return;
    }

    const needsPayment =
      form.status === "dibayar" ||
      form.status === "selesai" ||
      form.catatPembayaran;

    if (needsPayment && !form.metode) {
      setError("Pilih metode pembayaran untuk pesanan ini");
      return;
    }

    setLoading(true);
    try {
      const payload: PesananFormData = {
        lapangan_id: form.lapangan_id,
        tanggal_booking: new Date(form.tanggal).toISOString(),
        jam_mulai: combineDateTime(form.tanggal, form.jam_mulai),
        jam_selesai: combineDateTime(form.tanggal, form.jam_selesai),
        catatan: form.catatan || undefined,
        status: form.status,
      };

      if (isOwner && mode === "create") {
        payload.walk_in_customer = {
          name: form.customer_name.trim(),
          phone: form.customer_phone.trim(),
          email: form.customer_email.trim() || undefined,
        };
      } else {
        payload.user_id = form.user_id;
      }

      if (needsPayment && form.metode) {
        payload.pembayaran = {
          metode: form.metode,
          status: form.pembayaran_status,
        };
      }

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const selectedLapangan = lapanganOptions.find(
    (item) => String(item.id) === String(form.lapangan_id)
  );
  const showPaymentSection =
    form.status === "dibayar" ||
    form.status === "selesai" ||
    form.catatPembayaran;

  const handleStatusChange = (status: PesananStatus) => {
    setForm((prev) => ({
      ...prev,
      status,
      catatPembayaran:
        status === "dibayar" || status === "selesai"
          ? true
          : prev.catatPembayaran,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-gray-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              {mode === "create"
                ? isOwner
                  ? "Booking Walk-in"
                  : "Pesanan Baru"
                : "Edit Pesanan"}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-gray-900 dark:text-white">
              {mode === "create"
                ? isOwner
                  ? "Tambah Pelanggan Datang Langsung"
                  : "Tambah Booking"
                : initialData?.kode_booking}
            </h2>
            {isOwner && mode === "create" && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Pelanggan belum perlu punya akun — isi nama dan nomor HP.
                Email opsional.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {optionsLoading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Memuat data form...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label className={formLabelClass}>Pelanggan</label>
              {isOwner ? (
                mode === "create" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.customer_name}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            customer_name: e.target.value,
                          }))
                        }
                        placeholder="Contoh: Budi Santoso"
                        className={formInputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                        Nomor HP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.customer_phone}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            customer_phone: e.target.value,
                          }))
                        }
                        placeholder="08xxxxxxxxxx"
                        className={formInputClass}
                        required
                      />
                      {phoneLookup === "loading" && (
                        <p className="mt-1 text-xs text-gray-500">
                          Mengecek nomor...
                        </p>
                      )}
                      {phoneLookup === "found" && (
                        <p className="mt-1 text-xs text-cyan-600 dark:text-cyan-400">
                          Pelanggan pernah booking — data nama terisi otomatis.
                        </p>
                      )}
                      {phoneLookup === "new" && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Pelanggan baru — akan didaftarkan otomatis.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                        Email (opsional)
                      </label>
                      <input
                        type="email"
                        value={form.customer_email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            customer_email: e.target.value,
                          }))
                        }
                        placeholder="email@contoh.com"
                        className={formInputClass}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.customer_name || "Pelanggan"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                      {form.customer_phone}
                      {form.customer_email
                        ? ` · ${form.customer_email}`
                        : ""}
                    </p>
                  </div>
                )
              ) : (
                <select
                  value={form.user_id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, user_id: e.target.value }))
                  }
                  className={formSelectClass}
                  required
                >
                  <option value="">Pilih customer</option>
                  {userOptions.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name} — {user.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={formLabelClass}>Lapangan</label>
              <select
                value={form.lapangan_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lapangan_id: e.target.value }))
                }
                className={formSelectClass}
                required
              >
                <option value="">Pilih lapangan</option>
                {lapanganOptions.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.nama}
                    {!isOwner && item.owner_name
                      ? ` (${item.owner_name})`
                      : ""}
                  </option>
                ))}
              </select>
              {selectedLapangan && (
                <p className="mt-1 text-xs text-gray-500">
                  Harga: Rp{" "}
                  {Number(selectedLapangan.harga).toLocaleString("id-ID")}/sesi
                </p>
              )}
            </div>

            <div>
              <label className={formLabelClass}>Tanggal Booking</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tanggal: e.target.value }))
                }
                className={formInputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={formLabelClass}>Jam Mulai</label>
                <input
                  type="time"
                  value={form.jam_mulai}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, jam_mulai: e.target.value }))
                  }
                  className={formInputClass}
                  required
                />
              </div>
              <div>
                <label className={formLabelClass}>Jam Selesai</label>
                <input
                  type="time"
                  value={form.jam_selesai}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      jam_selesai: e.target.value,
                    }))
                  }
                  className={formInputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={formLabelClass}>Status Pesanan</label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as PesananStatus)
                }
                className={formSelectClass}
              >
                {statusChoices.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={formLabelClass + " mb-0"}>Pembayaran</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Catat metode bayar saat customer sudah membayar
                  </p>
                </div>
                {form.status === "pending" && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.catatPembayaran}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          catatPembayaran: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    Catat sekarang
                  </label>
                )}
              </div>

              {showPaymentSection ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={formLabelClass}>Metode Pembayaran</label>
                    <select
                      value={form.metode}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          metode: e.target.value as MetodePembayaran,
                        }))
                      }
                      className={formSelectClass}
                      required={showPaymentSection}
                    >
                      <option value="">Pilih metode</option>
                      {METODE_PEMBAYARAN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={formLabelClass}>Status Pembayaran</label>
                    <select
                      value={form.pembayaran_status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          pembayaran_status: e.target.value as StatusPembayaran,
                        }))
                      }
                      className={formSelectClass}
                    >
                      {STATUS_PEMBAYARAN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Pembayaran belum dicatat. Centang &quot;Catat sekarang&quot;
                  atau ubah status ke Dibayar/Selesai.
                </p>
              )}
            </div>

            <div>
              <label className={formLabelClass}>Catatan (opsional)</label>
              <textarea
                value={form.catatan}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, catatan: e.target.value }))
                }
                rows={3}
                placeholder="Catatan tambahan untuk booking..."
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
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === "create" ? (isOwner ? "Buat Booking" : "Buat Pesanan") : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
