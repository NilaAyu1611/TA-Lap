"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import AdminTable, { TableCell } from "@/components/admin/table/AdminTable";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatDisplayEmail } from "@/lib/customerEmail";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { Pesanan } from "@/types/pesanan";
import PesananStatusBadge from "./PesananStatusBadge";

const adminColumns = [
  { key: "kode", label: "Kode", align: "left" as const, width: "130px" },
  { key: "customer", label: "Customer", align: "left" as const, width: "160px" },
  { key: "lapangan", label: "Lapangan", align: "left" as const, width: "150px" },
  { key: "owner", label: "Owner", align: "left" as const, width: "120px" },
  { key: "jadwal", label: "Jadwal", align: "left" as const, width: "150px" },
  { key: "bayar", label: "Pembayaran", align: "center" as const, width: "110px" },
  { key: "total", label: "Total", align: "right" as const, width: "120px" },
  { key: "status", label: "Status", align: "center" as const, width: "100px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "110px" },
];

const ownerColumns = [
  { key: "kode", label: "Kode", align: "left" as const, width: "130px" },
  { key: "customer", label: "Customer", align: "left" as const, width: "160px" },
  { key: "lapangan", label: "Lapangan", align: "left" as const, width: "150px" },
  { key: "jadwal", label: "Jadwal", align: "left" as const, width: "150px" },
  { key: "bayar", label: "Pembayaran", align: "center" as const, width: "110px" },
  { key: "total", label: "Total", align: "right" as const, width: "120px" },
  { key: "status", label: "Status", align: "center" as const, width: "100px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "110px" },
];

type Props = {
  pesanan: Pesanan[];
  emptyMessage: string;
  variant?: "admin" | "owner";
  onDetail: (item: Pesanan) => void;
  onEdit?: (item: Pesanan) => void;
  onDelete?: (item: Pesanan) => void;
};

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
      : "border-gray-200/80 text-gray-500 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5";

  return (
    <button onClick={onClick} title={title} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

export default function PesananTable({
  pesanan,
  emptyMessage,
  variant = "admin",
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  const isOwner = variant === "owner";
  const columns = isOwner ? ownerColumns : adminColumns;
  const minWidth = isOwner ? "960px" : "1100px";
  if (pesanan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 dark:border-white/10">
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <AdminTable columns={columns} minWidth={minWidth}>
          {pesanan.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-cyan-50/50 dark:hover:bg-white/[0.02]"
            >
              <TableCell>
                <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                  {item.kode_booking}
                </span>
              </TableCell>

              <TableCell>
                <p className="truncate font-medium">{item.user_name || "—"}</p>
                {formatDisplayEmail(item.user_email) && (
                  <p className="truncate text-xs text-gray-500">
                    {formatDisplayEmail(item.user_email)}
                  </p>
                )}
              </TableCell>

              <TableCell>
                <p className="truncate font-medium">{item.lapangan_nama || "—"}</p>
                <p className="text-xs capitalize text-gray-500">
                  {item.lapangan_jenis || ""}
                </p>
              </TableCell>

              {!isOwner && (
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.owner_name || "—"}
                  </span>
                </TableCell>
              )}

              <TableCell>
                <p className="text-sm">{formatDate(item.tanggal_booking)}</p>
                <p className="text-xs text-gray-500">
                  {formatTime(item.jam_mulai)} – {formatTime(item.jam_selesai)}
                </p>
              </TableCell>

              <TableCell align="center">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formatMetodePembayaran(item.pembayaran?.metode)}
                </span>
              </TableCell>

              <TableCell align="right">
                <span className="font-semibold tabular-nums">
                  {formatRupiah(item.total_harga)}
                </span>
              </TableCell>

              <TableCell align="center">
                <PesananStatusBadge status={item.status} size="sm" />
              </TableCell>

              <TableCell align="center">
                <div className="flex items-center justify-center gap-1">
                  <ActionButton onClick={() => onDetail(item)} title="Detail">
                    <Eye size={15} />
                  </ActionButton>
                  {onEdit && (
                    <ActionButton onClick={() => onEdit(item)} title="Edit">
                      <Pencil size={15} />
                    </ActionButton>
                  )}
                  {!isOwner && onDelete && (
                    <ActionButton
                      onClick={() => onDelete(item)}
                      title="Hapus"
                      variant="danger"
                    >
                      <Trash2 size={15} />
                    </ActionButton>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </AdminTable>
      </div>

      <div className="grid gap-3 lg:hidden">
        {pesanan.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                  {item.kode_booking}
                </p>
                <p className="mt-1 font-semibold">{item.user_name}</p>
                <p className="text-sm text-gray-500">{item.lapangan_nama}</p>
              </div>
              <PesananStatusBadge status={item.status} size="sm" />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
              <span className="text-sm font-semibold">
                {formatRupiah(item.total_harga)}
              </span>
              <div className="flex gap-1.5">
                <ActionButton onClick={() => onDetail(item)} title="Detail">
                  <Eye size={15} />
                </ActionButton>
                {onEdit && (
                  <ActionButton onClick={() => onEdit(item)} title="Edit">
                    <Pencil size={15} />
                  </ActionButton>
                )}
                {!isOwner && onDelete && (
                  <ActionButton
                    onClick={() => onDelete(item)}
                    title="Hapus"
                    variant="danger"
                  >
                    <Trash2 size={15} />
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
