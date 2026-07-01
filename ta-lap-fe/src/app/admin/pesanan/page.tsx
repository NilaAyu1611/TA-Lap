"use client";

import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import DeletePesananDialog from "@/components/admin/pesanan/DeletePesananDialog";
import PesananDetailModal from "@/components/admin/pesanan/PesananDetailModal";
import PesananFilters from "@/components/admin/pesanan/PesananFilters";
import PesananModal from "@/components/admin/pesanan/PesananModal";
import PesananStatsSection from "@/components/admin/pesanan/PesananStats";
import PesananTable from "@/components/admin/pesanan/PesananTable";
import { usePesanan } from "@/hooks/usePesanan";
import { usePesananFormOptions, getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { upsertPembayaranByPesanan } from "@/services/pembayaran.service";
import {
  MetodePembayaran,
  StatusPembayaran,
} from "@/lib/pembayaran";
import {
  Pesanan,
  PesananFormData,
  PesananStatus,
  PesananStatusFilter,
} from "@/types/pesanan";

type ModalMode = "create" | "edit" | null;

function AdminPesananPageContent() {
  const searchParams = useSearchParams();
  const {
    pesanan,
    stats,
    loading,
    reload,
    createPesanan,
    updatePesanan,
    updateStatus,
    deletePesanan,
  } = usePesanan();

  usePesananFormOptions(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PesananStatusFilter>("all");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Pesanan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
        (item.lapangan_nama || "").toLowerCase().includes(q) ||
        (item.owner_name || "").toLowerCase().includes(q);

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

  const openDelete = (item: Pesanan) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (data: PesananFormData) => {
    try {
      if (modalMode === "create") {
        await createPesanan(data);
        showToast("success", "Pesanan berhasil dibuat");
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

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deletePesanan(selected.id);
      showToast("success", "Pesanan berhasil dihapus");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus pesanan";
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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat data pesanan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Manajemen Booking
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Kelola Pesanan
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Pantau dan kelola seluruh booking pelanggan, status pembayaran,
              dan jadwal lapangan dari satu tempat.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-cyan-600/20 transition hover:bg-cyan-500"
            >
              <Plus size={16} />
              Tambah Pesanan
            </button>
          </div>
        </div>
      </div>

      <PesananStatsSection stats={stats} />

      <PesananFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        totalCount={filtered.length}
      />

      <PesananTable
        pesanan={filtered}
        emptyMessage={
          search || status !== "all"
            ? "Tidak ada pesanan yang cocok dengan filter"
            : "Belum ada data pesanan"
        }
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <PesananModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      <PesananDetailModal
        open={detailOpen}
        pesanan={selected}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
      />

      <DeletePesananDialog
        open={deleteOpen}
        pesanan={selected}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default function AdminPesananPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-sm text-gray-500">
          Memuat pesanan...
        </div>
      }
    >
      <AdminPesananPageContent />
    </Suspense>
  );
}
