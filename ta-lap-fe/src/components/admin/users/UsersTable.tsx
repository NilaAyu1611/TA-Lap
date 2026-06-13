"use client";

import {
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User2,
} from "lucide-react";
import AdminTable, { TableCell } from "@/components/admin/table/AdminTable";
import UserStatusBadge from "@/components/admin/users/UserStatusBadge";
import { User } from "@/types/user";

const columns = [
  { key: "id", label: "ID", align: "center" as const, width: "72px" },
  { key: "user", label: "User", align: "left" as const, width: "200px" },
  { key: "kontak", label: "Kontak", align: "left" as const, width: "220px" },
  { key: "kota", label: "Kota", align: "left" as const, width: "120px" },
  { key: "booking", label: "Booking", align: "center" as const, width: "90px" },
  { key: "bayar", label: "Total Bayar", align: "right" as const, width: "130px" },
  { key: "status", label: "Status", align: "center" as const, width: "120px" },
  { key: "joined", label: "Bergabung", align: "center" as const, width: "110px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "130px" },
];

type Props = {
  users: User[];
  emptyMessage: string;
  onDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatId(id: string) {
  return id.padStart(3, "0");
}

function UserAvatar({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-cyan-500/20"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-xs font-bold text-cyan-500 ring-2 ring-cyan-500/20">
      {initials || <User2 size={18} />}
    </div>
  );
}

function ActionButton({
  onClick,
  title,
  variant = "default",
  children,
}: {
  onClick: () => void;
  title: string;
  variant?: "default" | "danger";
  children: React.ReactNode;
}) {
  const base =
    "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200";
  const styles =
    variant === "danger"
      ? "border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10"
      : "border-gray-200/80 text-gray-500 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 dark:border-white/10 dark:text-gray-400";

  return (
    <button onClick={onClick} title={title} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function UserCardMobile({
  user,
  onDetail,
  onEdit,
  onDelete,
}: {
  user: User;
  onDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <div>
            <p className="font-bold leading-tight">{user.name}</p>
            <span className="mt-1 inline-block rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500 dark:bg-white/10 dark:text-gray-400">
              #{formatId(user.id)}
            </span>
          </div>
        </div>
        <UserStatusBadge status={user.status} size="sm" />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Mail size={14} className="shrink-0 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Phone size={14} className="shrink-0 text-gray-400" />
          <span>{user.phone || "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin size={14} className="shrink-0 text-gray-400" />
          <span>{user.city || "-"}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.04]">
        <div className="text-center">
          <p className="text-xs text-gray-500">Booking</p>
          <p className="mt-0.5 font-bold">{user.totalBooking}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Bayar</p>
          <p className="mt-0.5 text-sm font-bold text-green-500">
            Rp {user.totalPayment.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Bergabung</p>
          <p className="mt-0.5 text-sm font-medium">{formatDate(user.joined)}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <ActionButton onClick={() => onDetail(user)} title="Detail">
          <Eye size={16} />
        </ActionButton>
        <ActionButton onClick={() => onEdit(user)} title="Edit">
          <Pencil size={16} />
        </ActionButton>
        <ActionButton onClick={() => onDelete(user)} title="Hapus" variant="danger">
          <Trash2 size={16} />
        </ActionButton>
      </div>
    </div>
  );
}

export default function UsersTable({
  users,
  emptyMessage,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 py-20 dark:border-white/10">
        <User2 size={40} className="text-gray-300 dark:text-gray-600" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <AdminTable columns={columns} minWidth="1060px">
          {users.map((user) => (
            <tr
              key={user.id}
              className="group transition-colors hover:bg-cyan-500/[0.03] dark:hover:bg-white/[0.02]"
            >
              <TableCell align="center">
                <span className="inline-flex min-w-[44px] items-center justify-center rounded-lg bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {formatId(user.id)}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <p className="truncate font-semibold leading-tight">
                    {user.name}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-200">
                    {user.email}
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-gray-500 dark:text-gray-400">
                    <Phone size={12} className="shrink-0" />
                    {user.phone || "-"}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-gray-700 dark:text-gray-300">
                  {user.city || "-"}
                </span>
              </TableCell>

              <TableCell align="center">
                <span className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg bg-gray-100 px-2 font-bold dark:bg-white/10">
                  {user.totalBooking}
                </span>
              </TableCell>

              <TableCell align="right">
                <span className="font-semibold tabular-nums text-green-600 dark:text-green-400">
                  Rp {user.totalPayment.toLocaleString("id-ID")}
                </span>
              </TableCell>

              <TableCell align="center">
                <div className="flex justify-center">
                  <UserStatusBadge status={user.status} size="sm" />
                </div>
              </TableCell>

              <TableCell align="center">
                <span className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {formatDate(user.joined)}
                </span>
              </TableCell>

              <TableCell align="center">
                <div className="flex items-center justify-center gap-1.5">
                  <ActionButton onClick={() => onDetail(user)} title="Detail">
                    <Eye size={15} />
                  </ActionButton>
                  <ActionButton onClick={() => onEdit(user)} title="Edit">
                    <Pencil size={15} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onDelete(user)}
                    title="Hapus"
                    variant="danger"
                  >
                    <Trash2 size={15} />
                  </ActionButton>
                </div>
              </TableCell>
            </tr>
          ))}
        </AdminTable>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="grid gap-4 lg:hidden">
        {users.map((user) => (
          <UserCardMobile
            key={user.id}
            user={user}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
