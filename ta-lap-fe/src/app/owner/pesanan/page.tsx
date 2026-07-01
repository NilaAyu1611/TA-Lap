"use client";

import { CalendarDays, Loader2, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import PesananDetailModal from "@/components/admin/pesanan/PesananDetailModal";
import PesananFilters from "@/components/admin/pesanan/PesananFilters";
import PesananModal from "@/components/admin/pesanan/PesananModal";
import PesananStatsSection from "@/components/admin/pesanan/PesananStats";
import PesananTable from "@/components/admin/pesanan/PesananTable";
import OwnerNavbar from "@/components/OwnerNavbar";
import { usePesanan } from "@/hooks/usePesanan";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import {
  MetodePembayaran,
  StatusPembayaran,
} from "@/lib/pembayaran";
import { upsertPembayaranByPesanan } from "@/services/pembayaran.service";
import {
  Pesanan,
  PesananFormData,
  PesananStatus,
  PesananStatusFilter,
} from "@/types/pesanan";

type ModalMode = "create" | "edit" | null;

export default function OwnerPesananPage() {
  const {
    pesanan,
    stats,
    loading,
    reload,
    createPesanan,
    updatePesanan,
    updateStatus,
  } = usePesanan();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PesananStatusFilter>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Pesanan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filtered = useMemo(() => {
    return pesanan.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.kode_booking.toLowerCase().includes(q) ||
        (item.user_name || "").toLowerCase().includes(q) ||
        (item.user_email || "").toLowerCase().includes(q) ||
        (item.lapangan_nama || "").toLowerCase().includes(q);

      const matchStatus = status === "all" || item.status === status;

      return matchSearch && matchStatus;
    });
  }, [pesanan, search, status]);

  useEffect(() => {
    if (!selected) return;
    const updated = pesanan.find((item) => item.id === selected.id);
    if (updated) setSelected(updated);
  }, [pesanan, selected?.id]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => {
    setSelected(null);
    setModalMode("create");
  };

  const openEdit = (item: Pesanan) => {
    setSelected(item);
    setModalMode("edit");
  };

  const openDetail = (item: Pesanan) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const handleSubmit = async (data: PesananFormData) => {
    try {
      if (modalMode === "create") {
        await createPesanan(data);
        showToast(
          "success",
          "Booking walk-in berhasil dicatat"
        );
      } else if (modalMode === "edit" && selected) {
        await updatePesanan(selected.id, data);
        showToast("success", "Pesanan berhasil diperbarui");
      }
      setModalMode(null);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      showToast("error", message);
      throw err;
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: PesananStatus) => {
    try {
      await updateStatus(id, newStatus);
      showToast("success", "Status pesanan diperbarui");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengubah status";
      showToast("error", message);
      throw err;
    }
  };

  const handleUpdatePayment = async (
    id: string,
    data: { metode: MetodePembayaran; status: StatusPembayaran }
  ) => {
    try {
      await upsertPembayaranByPesanan(id, data);
      await reload();
      showToast("success", "Pembayaran berhasil disimpan");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan pembayaran";
      showToast("error", message);
      throw err;
    }
  };

  return (
    <main className="relative min-h-screen bg-gray-50 text-gray-900 transition-all duration-300 dark:bg-[#020617] dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <OwnerNavbar active="pesanan" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6">
        {toast && (
          <div
            className={`fixed right-6 top-24 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat pesanan lapangan Anda...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <CalendarDays size={14} />
                    Booking Lapangan
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Kelola Pesanan
                  </h1>
                  <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                    Daftarkan pelanggan yang datang langsung ke venue — cukup
                    isi nama dan nomor HP. Email opsional. Pelanggan belum perlu
                    punya akun; booking terekap di sistem.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={reload}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                  <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-cyan-500"
                  >
                    <Plus size={16} />
                    Booking Walk-in
                  </button>
                </div>
              </div>
            </div>

            <PesananStatsSection stats={stats} />

            <div className="rounded-xl border border-gray-200/80 bg-white p-4 text-sm text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
              Isi data pelanggan manual saat mereka datang ke venue — nomor HP
              wajib, email opsional. Pelanggan tidak perlu daftar akun dulu.
              Setelah pembayaran sukses, transaksi muncul di{" "}
              <Link
                href="/owner/pembayaran"
                className="font-medium text-cyan-700 hover:underline dark:text-cyan-400"
              >
                Monitoring Pembayaran
              </Link>
              .
            </div>

            <PesananFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              totalCount={filtered.length}
              searchPlaceholder="Cari kode, customer, lapangan..."
            />

            <PesananTable
              pesanan={filtered}
              variant="owner"
              emptyMessage={
                search || status !== "all"
                  ? "Tidak ada pesanan yang cocok dengan filter"
                  : "Belum ada pesanan — klik Booking Walk-in untuk pelanggan datang langsung"
              }
              onDetail={openDetail}
              onEdit={openEdit}
            />
          </div>
        )}
      </section>

      <PesananModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        variant="owner"
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      <PesananDetailModal
        open={detailOpen}
        pesanan={selected}
        variant="owner"
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
      />
    </main>
  );
}
