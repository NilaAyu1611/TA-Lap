"use client";

import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import DeleteLapanganDialog from "@/components/admin/lapangan/DeleteLapanganDialog";
import LapanganDetailModal from "@/components/admin/lapangan/LapanganDetailModal";
import LapanganFilters from "@/components/admin/lapangan/LapanganFilters";
import LapanganModal from "@/components/admin/lapangan/LapanganModal";
import LapanganStatsSection from "@/components/admin/lapangan/LapanganStats";
import LapanganTable from "@/components/admin/lapangan/LapanganTable";
import { useLapangan } from "@/hooks/useLapangan";
import { useJenisOlahraga } from "@/hooks/useJenisOlahraga";
import {
  Lapangan,
  LapanganFormData,
  LapanganStatusFilter,
} from "@/types/lapangan";

type ModalMode = "create" | "edit" | null;

export default function AdminLapanganPage() {
  const {
    lapangan,
    stats,
    loading,
    reload,
    createLapangan,
    updateLapangan,
    deleteLapangan,
  } = useLapangan();
  const { items: jenisOptions } = useJenisOlahraga();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LapanganStatusFilter>("all");
  const [jenis, setJenis] = useState("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Lapangan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filtered = useMemo(() => {
    return lapangan.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        item.nama.toLowerCase().includes(q) ||
        (item.kota || "").toLowerCase().includes(q) ||
        (item.owner_name || "").toLowerCase().includes(q) ||
        (item.alamat || "").toLowerCase().includes(q);

      const matchStatus =
        status === "all" ||
        (status === "active" && item.status) ||
        (status === "inactive" && !item.status);

      const matchJenis =
        jenis === "all" || (item.jenis || "").toLowerCase() === jenis;

      return matchSearch && matchStatus && matchJenis;
    });
  }, [lapangan, search, status, jenis]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => {
    setSelected(null);
    setModalMode("create");
  };

  const openEdit = (item: Lapangan) => {
    setSelected(item);
    setModalMode("edit");
  };

  const openDetail = (item: Lapangan) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const openDelete = (item: Lapangan) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async (data: LapanganFormData) => {
    try {
      if (modalMode === "create") {
        await createLapangan(data);
        showToast("success", "Lapangan berhasil ditambahkan");
      } else if (modalMode === "edit" && selected) {
        await updateLapangan(selected.id, data);
        showToast("success", "Lapangan berhasil diperbarui");
      }
      setModalMode(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Terjadi kesalahan";
      showToast("error", message);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteLapangan(selected.id);
    showToast("success", "Lapangan berhasil dihapus");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat data lapangan...</span>
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
              Manajemen Venue
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Kelola Lapangan
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Admin dapat melihat, menambah, mengedit, dan menghapus semua
              lapangan dari seluruh owner.
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
              Tambah Lapangan
            </button>
          </div>
        </div>
      </div>

      <LapanganStatsSection stats={stats} />

      <LapanganFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        jenis={jenis}
        setJenis={setJenis}
        totalCount={filtered.length}
        jenisOptions={jenisOptions}
      />

      <LapanganTable
        lapangan={filtered}
        emptyMessage={
          search || status !== "all" || jenis !== "all"
            ? "Tidak ada lapangan yang cocok dengan filter"
            : "Belum ada data lapangan"
        }
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <LapanganModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      <LapanganDetailModal
        open={detailOpen}
        lapangan={selected}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
      />

      <DeleteLapanganDialog
        open={deleteOpen}
        lapangan={selected}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
