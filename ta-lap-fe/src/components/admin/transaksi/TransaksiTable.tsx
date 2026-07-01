"use client";

import { Eye } from "lucide-react";
import AdminTable, { TableCell } from "@/components/admin/table/AdminTable";
import { formatDate, formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { Transaksi } from "@/types/transaksi";
import KomisiStatusBadge from "./KomisiStatusBadge";
import PayoutStatusBadge from "@/components/admin/pembayaran/PayoutStatusBadge";
import TransaksiStatusBadge from "./TransaksiStatusBadge";

const columns = [
  { key: "kode", label: "Kode TRX", align: "left" as const, width: "120px" },
  { key: "booking", label: "Booking", align: "left" as const, width: "130px" },
  { key: "customer", label: "Customer", align: "left" as const, width: "140px" },
  { key: "owner", label: "Owner", align: "left" as const, width: "120px" },
  { key: "metode", label: "Metode", align: "center" as const, width: "100px" },
  { key: "total", label: "Total", align: "right" as const, width: "100px" },
  { key: "komisi", label: "Komisi 5%", align: "right" as const, width: "100px" },
  { key: "owner_share", label: "Owner", align: "right" as const, width: "100px" },
  { key: "status", label: "Status", align: "center" as const, width: "90px" },
  { key: "komisi_status", label: "Komisi", align: "center" as const, width: "100px" },
  { key: "payout", label: "Pencairan", align: "center" as const, width: "120px" },
  { key: "aksi", label: "Aksi", align: "center" as const, width: "70px" },
];

type Props = {
  transaksi: Transaksi[];
  emptyMessage: string;
  onDetail: (item: Transaksi) => void;
};

export default function TransaksiTable({
  transaksi,
  emptyMessage,
  onDetail,
}: Props) {
  if (transaksi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 dark:border-white/10">
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden xl:block">
        <AdminTable columns={columns} minWidth="1320px">
          {transaksi.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-cyan-50/50 dark:hover:bg-white/[0.02]"
            >
              <TableCell>
                <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                  {item.kode_transaksi}
                </span>
                <p className="text-[11px] text-gray-500">
                  {formatDate(item.created_at)}
                </p>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{item.kode_booking || "—"}</span>
                {item.tanggal_booking && (
                  <p className="text-[11px] text-gray-500">
                    {formatDate(item.tanggal_booking)}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <p className="truncate font-medium">{item.user_name || "—"}</p>
                <p className="truncate text-xs text-gray-500">{item.lapangan_nama}</p>
              </TableCell>
              <TableCell>
                <span className="text-sm">{item.owner_name || "—"}</span>
              </TableCell>
              <TableCell align="center">
                <span className="text-xs">
                  {formatMetodePembayaran(item.metode)}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="font-semibold tabular-nums">
                  {formatRupiah(item.total_bayar)}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="text-sm font-medium text-violet-600 tabular-nums dark:text-violet-400">
                  {formatRupiah(item.komisi_platform)}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="text-sm tabular-nums text-gray-600 dark:text-gray-400">
                  {formatRupiah(item.pendapatan_owner)}
                </span>
              </TableCell>
              <TableCell align="center">
                <TransaksiStatusBadge status={item.status} />
              </TableCell>
              <TableCell align="center">
                <KomisiStatusBadge status={item.status_komisi} />
              </TableCell>
              <TableCell align="center">
                {item.status === "sukses" ? (
                  <PayoutStatusBadge status={item.status_payout_owner} />
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell align="center">
                <button
                  onClick={() => onDetail(item)}
                  title="Detail"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/80 text-gray-500 transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <Eye size={15} />
                </button>
              </TableCell>
            </tr>
          ))}
        </AdminTable>
      </div>

      <div className="grid gap-3 xl:hidden">
        {transaksi.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                  {item.kode_transaksi}
                </p>
                <p className="mt-1 font-semibold">{item.user_name}</p>
                <p className="text-sm text-gray-500">{item.owner_name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <TransaksiStatusBadge status={item.status} />
                <KomisiStatusBadge status={item.status_komisi} />
                {item.status === "sukses" && (
                  <PayoutStatusBadge status={item.status_payout_owner} />
                )}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center dark:border-white/5">
              <div>
                <p className="text-[10px] uppercase text-gray-500">Total</p>
                <p className="text-sm font-semibold">{formatRupiah(item.total_bayar)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-500">Komisi</p>
                <p className="text-sm font-semibold text-violet-600">
                  {formatRupiah(item.komisi_platform)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-500">Owner</p>
                <p className="text-sm font-semibold">
                  {formatRupiah(item.pendapatan_owner)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDetail(item)}
              className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
