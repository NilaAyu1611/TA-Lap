"use client";

import { Loader2, Plus, RefreshCw, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import AddOwnerLapanganModal from "@/components/admin/owners/AddOwnerLapanganModal";
import DeleteOwnerDialog from "@/components/admin/owners/DeleteOwnerDialog";
import OwnerDetailModal from "@/components/admin/owners/OwnerDetailModal";
import OwnerFilters, {
  matchesOwnerActivity,
} from "@/components/admin/owners/OwnerFilters";
import OwnerModal from "@/components/admin/owners/OwnerModal";
import OwnerStatsSection from "@/components/admin/owners/OwnerStats";
import OwnersTable from "@/components/admin/owners/OwnersTable";
import { useOwners } from "@/hooks/useOwners";
import { Owner, OwnerActivityFilter, OwnerFormData, OwnerStatus } from "@/types/owner";

type ModalMode = "create" | "edit" | null;

function AdminOwnersContent() {
  const searchParams = useSearchParams();
  const { owners, stats, loading, error, reload, createOwner, updateOwner, deleteOwner, approveOwner, rejectOwner, actionLoading } =
    useOwners();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OwnerStatus>("all");
  const [activity, setActivity] = useState<OwnerActivityFilter>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [lapanganOpen, setLapanganOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get("review") === "pending") {
      setActivity("menunggu_verifikasi");
      setStatus("pending");
    }
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const matchSearch =
        owner.name.toLowerCase().includes(search.toLowerCase()) ||
        owner.email.toLowerCase().includes(search.toLowerCase()) ||
        (owner.phone || "").includes(search) ||
        (owner.city || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || owner.status === status;
      const matchActivity = matchesOwnerActivity(owner, activity);
      return matchSearch && matchStatus && matchActivity;
    });
  }, [owners, search, status, activity]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => {
    setSelectedOwner(null);
    setModalMode("create");
  };

  const openEdit = (owner: Owner) => {
    setSelectedOwner(owner);
    setModalMode("edit");
  };

  const openDetail = (owner: Owner) => {
    setSelectedOwner(owner);
    setDetailOpen(true);
  };

  const openDelete = (owner: Owner) => {
    setSelectedOwner(owner);
    setDeleteOpen(true);
  };

  const openAddLapangan = (owner: Owner) => {
    setSelectedOwner(owner);
    setLapanganOpen(true);
  };

  const handleSubmit = async (data: OwnerFormData) => {
    try {
      if (modalMode === "create") {
        await createOwner(data);
        showToast(
          "success",
          "Owner berhasil ditambahkan. Tambahkan lapangan lewat Detail."
        );
      } else if (modalMode === "edit" && selectedOwner) {
        await updateOwner(selectedOwner.id, data);
        showToast("success", "Data owner berhasil diperbarui");
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
    if (!selectedOwner) return;
    await deleteOwner(selectedOwner.id);
    showToast("success", "Owner berhasil dihapus");
  };

  const handleApprove = async (owner: Owner) => {
    try {
      const result = await approveOwner(owner.id);
      showToast("success", result.message);
      setDetailOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyetujui owner";
      showToast("error", message);
      throw err;
    }
  };

  const handleReject = async (owner: Owner, notes: string) => {
    try {
      const result = await rejectOwner(owner.id, notes);
      showToast("success", result.message);
      setDetailOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menolak pendaftaran";
      showToast("error", message);
      throw err;
    }
  };

  const handleLapanganAdded = async () => {
    await reload();
    if (selectedOwner) {
      const updated = (await reload(), owners.find((o) => o.id === selectedOwner.id));
      if (updated) setSelectedOwner(updated);
    }
    showToast("success", "Lapangan berhasil ditambahkan");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Memuat data owner...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/30 dark:bg-red-500/10">
        <p className="font-medium text-red-700 dark:text-red-300">
          Gagal memuat data owner
        </p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={reload}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const currentOwner =
    selectedOwner && owners.find((o) => o.id === selectedOwner.id)
      ? owners.find((o) => o.id === selectedOwner.id)!
      : selectedOwner;

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
              Manajemen Owner
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Kelola Owner
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              Buat akun owner, verifikasi, dan kelola lapangan venue.
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
              Tambah Owner
            </button>
          </div>
        </div>
      </div>

      <OwnerStatsSection stats={stats} />

      {stats.pendingReview > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-500/30 dark:bg-violet-500/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-600 p-2 text-white">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="font-semibold text-violet-900 dark:text-violet-100">
                {stats.pendingReview} pendaftaran owner menunggu verifikasi
              </p>
              <p className="mt-1 text-sm text-violet-700 dark:text-violet-300">
                Data dari form &quot;Daftar Owner&quot; di website masuk ke halaman ini.
                Buka Detail → klik <strong>Setujui Owner</strong> (verifikasi + aktifkan
                akun sekaligus).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActivity("menunggu_verifikasi");
              setStatus("pending");
            }}
            className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Lihat Pendaftaran Baru
          </button>
        </div>
      )}

      <OwnerFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        activity={activity}
        setActivity={setActivity}
        totalCount={filteredOwners.length}
      />

      <OwnersTable
        owners={filteredOwners}
        emptyMessage={
          search || status !== "all" || activity !== "all"
            ? "Tidak ada owner yang cocok dengan filter"
            : "Belum ada data owner"
        }
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <OwnerModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selectedOwner}
      />

      <OwnerDetailModal
        open={detailOpen}
        owner={currentOwner}
        reviewLoading={actionLoading}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
        onAddLapangan={openAddLapangan}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AddOwnerLapanganModal
        open={lapanganOpen}
        owner={currentOwner}
        onClose={() => setLapanganOpen(false)}
        onSuccess={async () => {
          await reload();
          showToast("success", "Lapangan berhasil ditambahkan");
        }}
      />

      <DeleteOwnerDialog
        open={deleteOpen}
        owner={selectedOwner}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default function AdminOwnersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-sm text-gray-500">
          Memuat...
        </div>
      }
    >
      <AdminOwnersContent />
    </Suspense>
  );
}
