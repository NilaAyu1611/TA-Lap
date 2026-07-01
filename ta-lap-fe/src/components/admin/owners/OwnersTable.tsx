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
import { formatRupiah } from "@/lib/auth";
import { Owner, VerificationStatus } from "@/types/owner";

const columns = [
  { key: "id", label: "ID", align: "center" as const, width: "72px" },
  { key: "owner", label: "Owner", align: "left" as const, width: "200px" },
  { key: "kontak", label: "Kontak", align: "left" as const, width: "220px" },
  { key: "kota", label: "Kota", align: "left" as const, width: "110px" },
  { key: "lapangan", label: "Lapangan", align: "center" as const, width: "100px" },
  {
    key: "performa",
    label: "Performa",
    align: "center" as const,
    width: "130px",
  },
  {
    key: "verifikasi",
    label: "Verifikasi",
    align: "center" as const,
    width: "120px",
  },
  { key: "status", label: "Status", align: "center" as const, width: "110px" },
  { key: "joined", label: "Bergabung", align: "center" as const, width: "110px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "120px" },
];

type Props = {
  owners: Owner[];
  emptyMessage: string;
  onDetail: (owner: Owner) => void;
  onEdit: (owner: Owner) => void;
  onDelete: (owner: Owner) => void;
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

function needsReview(owner: Owner) {
  return owner.status === "pending" && owner.verificationStatus === "pending";
}

function rowClassName(owner: Owner) {
  if (needsReview(owner)) {
    return "bg-violet-50/80 transition-colors hover:bg-violet-50 dark:bg-violet-500/5 dark:hover:bg-violet-500/10";
  }
  return "transition-colors hover:bg-cyan-50/50 dark:hover:bg-white/[0.02]";
}

function OwnerActivityBadge({ owner }: { owner: Owner }) {
  if (owner.totalLapangan === 0) {
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/10">
        Tanpa venue
      </span>
    );
  }
  if (owner.transaksiSukses === 0) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
        Belum laku
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
      {owner.transaksiSukses} transaksi
    </span>
  );
}

function OwnerAvatar({ owner }: { owner: Owner }) {
  const initials = owner.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (owner.avatar) {
    return (
      <img
        src={owner.avatar}
        alt={owner.name}
        className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-white/10"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
      {initials || <User2 size={18} />}
    </div>
  );
}

function VerificationBadge({ status }: { status: VerificationStatus | null }) {
  const config = {
    approved: {
      label: "Terverifikasi",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    },
    pending: {
      label: "Menunggu",
      className:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-red-500/10 text-red-500 ring-red-500/20",
    },
  } as const;

  const item = status ? config[status] : null;

  if (!item) {
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${item.className}`}
    >
      {item.label}
    </span>
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
    "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors";
  const styles =
    variant === "danger"
      ? "border-red-500/20 text-red-500 hover:bg-red-500/10"
      : "border-gray-200/80 text-gray-500 hover:bg-gray-100 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5";

  return (
    <button onClick={onClick} title={title} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function OwnerCardMobile({
  owner,
  onDetail,
  onEdit,
  onDelete,
}: {
  owner: Owner;
  onDetail: (owner: Owner) => void;
  onEdit: (owner: Owner) => void;
  onDelete: (owner: Owner) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <OwnerAvatar owner={owner} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{owner.name}</p>
            <p className="mt-0.5 font-mono text-xs text-gray-400">
              #{formatId(owner.id)}
            </p>
          </div>
        </div>
        <UserStatusBadge status={owner.status} size="sm" />
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        <p className="flex items-center gap-2 truncate">
          <Mail size={14} className="shrink-0 text-gray-400" />
          {owner.email}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} className="shrink-0 text-gray-400" />
          {owner.phone || "—"}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0 text-gray-400" />
          {owner.city || "—"}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>
              {owner.lapanganAktif}/{owner.totalLapangan} lapangan
            </span>
            <VerificationBadge status={owner.verificationStatus} />
          </div>
          <OwnerActivityBadge owner={owner} />
        </div>
        <div className="flex gap-1.5">
          <ActionButton onClick={() => onDetail(owner)} title="Detail">
            <Eye size={15} />
          </ActionButton>
          <ActionButton onClick={() => onEdit(owner)} title="Edit">
            <Pencil size={15} />
          </ActionButton>
          <ActionButton
            onClick={() => onDelete(owner)}
            title="Hapus"
            variant="danger"
          >
            <Trash2 size={15} />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default function OwnersTable({
  owners,
  emptyMessage,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  if (owners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 dark:border-white/10">
        <User2 size={36} className="text-gray-300 dark:text-gray-600" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <AdminTable columns={columns} minWidth="1040px">
          {owners.map((owner) => (
            <tr key={owner.id} className={rowClassName(owner)}>
              <TableCell align="center">
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {formatId(owner.id)}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <OwnerAvatar owner={owner} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{owner.name}</p>
                    {owner.registrationSource === "website" && needsReview(owner) && (
                      <span className="mt-0.5 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                        Daftar Website
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-0.5">
                  <p className="truncate text-gray-800 dark:text-gray-200">
                    {owner.email}
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-gray-500">
                    <Phone size={12} className="shrink-0" />
                    {owner.phone || "—"}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-gray-600 dark:text-gray-400">
                  {owner.city || "—"}
                </span>
              </TableCell>

              <TableCell align="center">
                <span className="tabular-nums text-gray-700 dark:text-gray-300">
                  {owner.lapanganAktif}
                  <span className="text-gray-400">/{owner.totalLapangan}</span>
                </span>
              </TableCell>

              <TableCell align="center">
                <div className="flex flex-col items-center gap-1">
                  <OwnerActivityBadge owner={owner} />
                  {owner.transaksiSukses > 0 && (
                    <span className="text-[10px] text-gray-500">
                      {formatRupiah(owner.volumeTransaksi)}
                    </span>
                  )}
                  {owner.totalBooking > 0 && owner.transaksiSukses === 0 && (
                    <span className="text-[10px] text-amber-600">
                      {owner.totalBooking} booking
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell align="center">
                <VerificationBadge status={owner.verificationStatus} />
              </TableCell>

              <TableCell align="center">
                <div className="flex justify-center">
                  <UserStatusBadge status={owner.status} size="sm" />
                </div>
              </TableCell>

              <TableCell align="center">
                <span className="whitespace-nowrap text-xs text-gray-500">
                  {formatDate(owner.joined)}
                </span>
              </TableCell>

              <TableCell align="center">
                <div className="flex items-center justify-center gap-1">
                  <ActionButton onClick={() => onDetail(owner)} title="Detail">
                    <Eye size={15} />
                  </ActionButton>
                  <ActionButton onClick={() => onEdit(owner)} title="Edit">
                    <Pencil size={15} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onDelete(owner)}
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

      <div className="grid gap-3 lg:hidden">
        {owners.map((owner) => (
          <OwnerCardMobile
            key={owner.id}
            owner={owner}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
