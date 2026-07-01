"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminTable, { TableCell } from "@/components/admin/table/AdminTable";
import { filterSearchInputClass } from "@/components/admin/lapangan/formStyles";
import KomisiStatusBadge from "@/components/admin/transaksi/KomisiStatusBadge";
import TransaksiStatusBadge from "@/components/admin/transaksi/TransaksiStatusBadge";
import { formatDate, formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { Transaksi } from "@/types/transaksi";

const adminColumns = [
  { key: "kode", label: "Kode TRX", align: "left" as const, width: "110px" },
  { key: "booking", label: "Booking", align: "left" as const, width: "120px" },
  { key: "customer", label: "Customer / Lapangan", align: "left" as const, width: "160px" },
  { key: "owner", label: "Owner", align: "left" as const, width: "120px" },
  { key: "metode", label: "Metode", align: "center" as const, width: "90px" },
  { key: "total", label: "Total", align: "right" as const, width: "100px" },
  { key: "komisi", label: "Komisi", align: "right" as const, width: "90px" },
  { key: "owner_share", label: "Owner", align: "right" as const, width: "90px" },
  { key: "status", label: "Status", align: "center" as const, width: "90px" },
  { key: "komisi_status", label: "Komisi", align: "center" as const, width: "100px" },
];

const ownerColumns = [
  { key: "kode", label: "Kode TRX", align: "left" as const, width: "110px" },
  { key: "booking", label: "Booking", align: "left" as const, width: "120px" },
  { key: "customer", label: "Customer / Lapangan", align: "left" as const, width: "160px" },
  { key: "metode", label: "Metode", align: "center" as const, width: "90px" },
  { key: "total", label: "Total", align: "right" as const, width: "100px" },
  { key: "komisi", label: "Komisi", align: "right" as const, width: "90px" },
  { key: "owner_share", label: "Pendapatan", align: "right" as const, width: "100px" },
  { key: "refund", label: "Refund", align: "right" as const, width: "90px" },
  { key: "status", label: "Status", align: "center" as const, width: "90px" },
  { key: "komisi_status", label: "Komisi", align: "center" as const, width: "100px" },
];

type Props = {
  transaksi: Transaksi[];
  variant?: "admin" | "owner";
};

export default function LaporanTransaksiDetail({
  transaksi,
  variant = "admin",
}: Props) {
  const isOwner = variant === "owner";
  const columns = isOwner ? ownerColumns : adminColumns;
  const minWidth = isOwner ? "1000px" : "1100px";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transaksi.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        item.kode_transaksi,
        item.kode_booking,
        item.user_name,
        item.user_email,
        item.lapangan_nama,
        item.owner_name,
        item.metode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [transaksi, query, statusFilter]);

  const totals = useMemo(() => {
    const sukses = filtered.filter((t) => t.status === "sukses");
    return {
      count: filtered.length,
      volume: sukses.reduce((s, t) => s + Number(t.total_bayar || 0), 0),
      komisi: sukses.reduce((s, t) => s + Number(t.komisi_platform || 0), 0),
      pendapatan: sukses.reduce((s, t) => s + Number(t.pendapatan_owner || 0), 0),
    };
  }, [filtered]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-4 py-4 dark:border-white/5 sm:px-5">
        <h3 className="text-base font-semibold">
          {isOwner ? "Arsip Transaksi Venue" : "Detail Semua Transaksi"}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {transaksi.length} transaksi —{" "}
          {isOwner
            ? "setiap booking sukses = 1 baris komisi terpisah"
            : "untuk audit, arsip perusahaan, dan backup CSV"}
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center print:hidden">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder={isOwner ? "Cari kode, customer, lapangan..." : "Cari kode, customer, lapangan, owner..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={filterSearchInputClass}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/15 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">Semua status</option>
            <option value="sukses">Sukses</option>
            <option value="menunggu">Menunggu</option>
            <option value="gagal">Gagal</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>
            Ditampilkan: <strong className="text-gray-800 dark:text-gray-200">{totals.count}</strong>
          </span>
          <span>
            Volume sukses:{" "}
            <strong className="text-gray-800 dark:text-gray-200">
              {formatRupiah(totals.volume)}
            </strong>
          </span>
          <span>
            {isOwner ? "Pendapatan sukses" : "Komisi sukses"}:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {formatRupiah(isOwner ? totals.pendapatan : totals.komisi)}
            </strong>
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-gray-500">
          Tidak ada transaksi yang cocok dengan filter.
        </div>
      ) : (
        <div className="overflow-x-auto print:overflow-visible">
          <AdminTable columns={columns} minWidth={minWidth}>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-cyan-50/50 dark:hover:bg-white/[0.02]"
              >
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                    {item.kode_transaksi}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    {formatDate(item.tanggal_bayar || item.created_at)}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{item.kode_booking || "—"}</span>
                  {item.tanggal_booking && (
                    <p className="text-[11px] text-gray-500">
                      Main: {formatDate(item.tanggal_booking)}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="truncate font-medium">{item.user_name || "—"}</p>
                  <p className="truncate text-xs text-gray-500">{item.lapangan_nama || "—"}</p>
                </TableCell>
                {!isOwner && (
                  <TableCell>
                    <span className="text-sm">{item.owner_name || "—"}</span>
                  </TableCell>
                )}
                <TableCell align="center">
                  <span className="text-xs">{formatMetodePembayaran(item.metode)}</span>
                </TableCell>
                <TableCell align="right">
                  <span className="font-semibold tabular-nums">
                    {formatRupiah(item.total_bayar)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(item.komisi_platform)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span className="tabular-nums">{formatRupiah(item.pendapatan_owner)}</span>
                </TableCell>
                {isOwner && (
                  <TableCell align="right">
                    <span className="tabular-nums text-red-600 dark:text-red-400">
                      {item.jumlah_refund ? formatRupiah(item.jumlah_refund) : "—"}
                    </span>
                  </TableCell>
                )}
                <TableCell align="center">
                  <TransaksiStatusBadge status={item.status} />
                </TableCell>
                <TableCell align="center">
                  <KomisiStatusBadge status={item.status_komisi} />
                </TableCell>
              </tr>
            ))}
          </AdminTable>
        </div>
      )}
    </div>
  );
}
