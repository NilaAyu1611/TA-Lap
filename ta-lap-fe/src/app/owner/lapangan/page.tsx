"use client";

import { Building2, Loader2, Plus, RefreshCw, Users } from "lucide-react";
import { useMemo, useState } from "react";

import DeleteLapanganDialog from "@/components/admin/lapangan/DeleteLapanganDialog";
import LapanganDetailModal from "@/components/admin/lapangan/LapanganDetailModal";
import LapanganFilters from "@/components/admin/lapangan/LapanganFilters";
import LapanganModal from "@/components/admin/lapangan/LapanganModal";
import LapanganStatsSection from "@/components/admin/lapangan/LapanganStats";
import LapanganTable from "@/components/admin/lapangan/LapanganTable";
import OwnerNavbar from "@/components/OwnerNavbar";
import VenueHierarchyGuide from "@/components/shared/VenueHierarchyGuide";
import { useLapangan } from "@/hooks/useLapangan";
import { useJenisOlahraga } from "@/hooks/useJenisOlahraga";
import {
  Lapangan,
  LapanganFormData,
  LapanganStatusFilter,
} from "@/types/lapangan";

type ModalMode = "create" | "edit" | null;

export default function OwnerLapanganPage() {
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
        (item.alamat || "").toLowerCase().includes(q) ||
        (item.jenis || "").toLowerCase().includes(q);

      const matchStatus =
        status === "all" ||
        (status === "active" && item.status) ||
        (status === "inactive" && !item.status);

      const matchJenis =
        jenis === "all" || (item.jenis || "").toLowerCase() === jenis;

      return matchSearch && matchStatus && matchJenis;
    });
  }, [lapangan, search, status, jenis]);

  const incompleteVenueCount = useMemo(
    () => lapangan.filter((item) => !item.kapasitas || !item.jumlah_court).length,
    [lapangan]
  );

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
        showToast("success", "Lapangan berhasil didaftarkan");
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
    try {
      await deleteLapangan(selected.id);
      showToast("success", "Lapangan berhasil dihapus");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus lapangan";
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

      <OwnerNavbar active="lapangan" />

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
              <span>Memuat lapangan Anda...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-cyan-50 via-white to-white p-6 shadow-sm dark:border-white/10 dark:from-cyan-950/20 dark:via-gray-900/50 dark:to-gray-900/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    <Building2 size={14} />
                    Venue Saya
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Kelola Lapangan
                  </h1>
                  <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                    Daftarkan dan kelola semua lapangan milik bisnis Anda —
                    futsal, badminton, dan jenis olahraga lainnya.
                  </p>
                </div>

                <div className="flex gap-2">
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
                    Daftar Lapangan
                  </button>
                </div>
              </div>
            </div>

            <VenueHierarchyGuide variant="compact" />

            <LapanganStatsSection stats={stats} variant="owner" />

            {incompleteVenueCount > 0 && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-amber-500 p-2 text-white">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                      {incompleteVenueCount} lapangan belum lengkap info kapasitas
                    </p>
                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                      Isi kapasitas maksimal & jumlah court di Edit — data ini
                      ditampilkan ke user saat mereka booking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <LapanganFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              jenis={jenis}
              setJenis={setJenis}
              totalCount={filtered.length}
              jenisOptions={jenisOptions}
              searchPlaceholder="Cari nama, kota, jenis..."
            />

            <LapanganTable
              lapangan={filtered}
              showOwner={false}
              emptyMessage={
                search || status !== "all" || jenis !== "all"
                  ? "Tidak ada lapangan yang cocok dengan filter"
                  : "Belum ada lapangan terdaftar — klik Daftar Lapangan"
              }
              onDetail={openDetail}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        )}
      </section>

      <LapanganModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        variant="owner"
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      <LapanganDetailModal
        open={detailOpen}
        lapangan={selected}
        showOwner={false}
        variant="owner"
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
      />

      <DeleteLapanganDialog
        open={deleteOpen}
        lapangan={selected}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
