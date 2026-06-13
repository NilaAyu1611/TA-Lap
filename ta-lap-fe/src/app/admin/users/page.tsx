"use client";

import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import DeleteUserDialog from "@/components/admin/users/DeleteUserDialog";
import UserDetailModal from "@/components/admin/users/UserDetailModal";
import UserFilters from "@/components/admin/users/UserFilters";
import UserModal from "@/components/admin/users/UserModal";
import UserStatsSection from "@/components/admin/users/UserStats";
import UsersTable from "@/components/admin/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { User, UserFormData, UserStatus } from "@/types/user";

type ModalMode = "create" | "edit" | null;

export default function AdminUsersPage() {
  const { users, stats, loading, reload, createUser, updateUser, deleteUser } =
    useUsers();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.phone || "").includes(search) ||
        (user.city || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || user.status === status;
      return matchSearch && matchStatus;
    });
  }, [users, search, status]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
  };

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (modalMode === "create") {
        await createUser(data);
        showToast("success", "User berhasil ditambahkan");
      } else if (modalMode === "edit" && selectedUser) {
        await updateUser(selectedUser.id, data);
        showToast("success", "Data user berhasil diperbarui");
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
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    showToast("success", "User berhasil dihapus");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
          <span>Memuat data user...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed right-6 top-24 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            Admin Users
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Kelola Seluruh User
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-400">
            Tambah, edit, dan kelola status akun pengguna TA-LAP. Data terhubung
            langsung ke database melalui API backend.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 text-sm font-semibold transition hover:border-cyan-500 dark:border-white/10"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-3 rounded-2xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-400"
          >
            <Plus size={18} />
            Tambah User
          </button>
        </div>
      </div>

      {/* STATS */}
      <UserStatsSection stats={stats} />

      {/* FILTERS */}
      <UserFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* TABLE */}
      <UsersTable
        users={filteredUsers}
        emptyMessage={
          search || status !== "all"
            ? "Tidak ada user yang cocok dengan filter"
            : "Belum ada data user"
        }
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* MODALS */}
      <UserModal
        open={modalMode !== null}
        mode={modalMode === "create" ? "create" : "edit"}
        onClose={() => setModalMode(null)}
        onSubmit={handleSubmit}
        initialData={selectedUser}
      />

      <UserDetailModal
        open={detailOpen}
        user={selectedUser}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
      />

      <DeleteUserDialog
        open={deleteOpen}
        user={selectedUser}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
