"use client";

import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import AdminTable, { TableCell } from "@/components/admin/table/AdminTable";
import { Lapangan } from "@/types/lapangan";

const adminColumns = [
  { key: "id", label: "ID", align: "center" as const, width: "72px" },
  { key: "nama", label: "Lapangan", align: "left" as const, width: "200px" },
  { key: "owner", label: "Owner", align: "left" as const, width: "160px" },
  { key: "jenis", label: "Jenis", align: "center" as const, width: "100px" },
  { key: "kapasitas", label: "Kapasitas", align: "center" as const, width: "100px" },
  { key: "kota", label: "Kota", align: "left" as const, width: "110px" },
  { key: "harga", label: "Harga/Sesi", align: "right" as const, width: "120px" },
  { key: "booking", label: "Booking", align: "center" as const, width: "80px" },
  { key: "status", label: "Status", align: "center" as const, width: "90px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "110px" },
];

const ownerColumns = adminColumns.filter((col) => col.key !== "owner");

type Props = {
  lapangan: Lapangan[];
  emptyMessage: string;
  showOwner?: boolean;
  onDetail: (item: Lapangan) => void;
  onEdit: (item: Lapangan) => void;
  onDelete: (item: Lapangan) => void;
};

function formatId(id: string) {
  return id.padStart(3, "0");
}

function formatHarga(harga: number) {
  return `Rp ${harga.toLocaleString("id-ID")}`;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
          : "bg-gray-100 text-gray-500 ring-gray-200 dark:bg-white/10 dark:text-gray-400 dark:ring-white/10"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function KapasitasBadge({ kapasitas }: { kapasitas: number | null }) {
  if (!kapasitas) {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400">
        Belum diisi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium tabular-nums text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400">
      ±{kapasitas}
    </span>
  );
}

function JenisBadge({ jenis }: { jenis: string | null }) {
  const label = jenis ? jenis.charAt(0).toUpperCase() + jenis.slice(1) : "—";
  return (
    <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-white/10 dark:text-gray-300">
      {label}
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
      : "border-gray-200/80 text-gray-500 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5";

  return (
    <button onClick={onClick} title={title} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function LapanganCardMobile({
  item,
  showOwner = true,
  onDetail,
  onEdit,
  onDelete,
}: {
  item: Lapangan;
  showOwner?: boolean;
  onDetail: (item: Lapangan) => void;
  onEdit: (item: Lapangan) => void;
  onDelete: (item: Lapangan) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {item.nama}
          </p>
          <p className="mt-0.5 font-mono text-xs text-gray-400">
            #{formatId(item.id)}
          </p>
        </div>
        <StatusBadge active={item.status} />
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        {showOwner && <p>Owner: {item.owner_name || "—"}</p>}
        <p className="flex items-center gap-1.5 capitalize">
          <MapPin size={14} className="shrink-0 text-gray-400" />
          {item.kota || "—"} · {item.jenis || "—"}
        </p>
        <p className="text-xs text-gray-500">
          Kapasitas:{" "}
          {item.kapasitas ? (
            <span className="font-medium text-cyan-700 dark:text-cyan-400">
              ±{item.kapasitas} orang
            </span>
          ) : (
            <span className="font-medium text-amber-600">Belum diisi</span>
          )}
        </p>
        <p className="font-medium text-gray-900 dark:text-white">
          {formatHarga(item.harga)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
        <span className="text-xs text-gray-500">
          {item.totalBooking} booking
        </span>
        <div className="flex gap-1.5">
          <ActionButton onClick={() => onDetail(item)} title="Detail">
            <Eye size={15} />
          </ActionButton>
          <ActionButton onClick={() => onEdit(item)} title="Edit">
            <Pencil size={15} />
          </ActionButton>
          <ActionButton
            onClick={() => onDelete(item)}
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

export default function LapanganTable({
  lapangan,
  emptyMessage,
  showOwner = true,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  const columns = showOwner ? adminColumns : ownerColumns;
  if (lapangan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 dark:border-white/10">
        <MapPin size={36} className="text-gray-300 dark:text-gray-600" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <AdminTable columns={columns} minWidth="1080px">
          {lapangan.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-cyan-50/50 dark:hover:bg-white/[0.02]"
            >
              <TableCell align="center">
                <span className="font-mono text-xs text-gray-500">
                  {formatId(item.id)}
                </span>
              </TableCell>

              <TableCell>
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {item.nama}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {item.alamat || "Alamat belum diisi"}
                </p>
              </TableCell>

              {showOwner && (
                <TableCell>
                  <p className="truncate text-sm font-medium">
                    {item.owner_name || "—"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {item.owner_email || ""}
                  </p>
                </TableCell>
              )}

              <TableCell align="center">
                <JenisBadge jenis={item.jenis} />
              </TableCell>

              <TableCell align="center">
                <KapasitasBadge kapasitas={item.kapasitas} />
              </TableCell>

              <TableCell>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.kota || "—"}
                </span>
              </TableCell>

              <TableCell align="right">
                <span className="font-medium tabular-nums text-gray-900 dark:text-white">
                  {formatHarga(item.harga)}
                </span>
              </TableCell>

              <TableCell align="center">
                <span className="tabular-nums text-gray-600 dark:text-gray-400">
                  {item.totalBooking}
                </span>
              </TableCell>

              <TableCell align="center">
                <StatusBadge active={item.status} />
              </TableCell>

              <TableCell align="center">
                <div className="flex items-center justify-center gap-1">
                  <ActionButton onClick={() => onDetail(item)} title="Detail">
                    <Eye size={15} />
                  </ActionButton>
                  <ActionButton onClick={() => onEdit(item)} title="Edit">
                    <Pencil size={15} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onDelete(item)}
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
        {lapangan.map((item) => (
          <LapanganCardMobile
            key={item.id}
            item={item}
            showOwner={showOwner}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
