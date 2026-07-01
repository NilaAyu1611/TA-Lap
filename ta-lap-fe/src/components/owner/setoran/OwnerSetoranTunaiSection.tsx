"use client";

import {
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatRupiah } from "@/lib/auth";
import { getOwnerKewajibanSetoran } from "@/services/transaksi.service";
import OwnerSetoranSubmitModal from "@/components/owner/setoran/OwnerSetoranSubmitModal";
import {
  OwnerKewajibanSetoranMonth,
  SetoranTujuanBayar,
  SetoranTunaiStatus,
} from "@/types/setoranTunai";

function StatusBadge({ status }: { status: SetoranTunaiStatus }) {
  const styles: Record<SetoranTunaiStatus, string> = {
    menunggu:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    disetor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    kosong: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400",
  };
  const labels: Record<SetoranTunaiStatus, string> = {
    menunggu: "Belum Setor",
    disetor: "Sudah Lunas",
    kosong: "Tidak Ada Tunai",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

type Props = {
  variant?: "full" | "compact";
  onSubmitted?: () => void;
};

function PengajuanLabel({ row }: { row: OwnerKewajibanSetoranMonth }) {
  if (row.pengajuan_status === "menunggu_verifikasi") {
    return (
      <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
        Menunggu verifikasi admin
      </span>
    );
  }
  if (row.pengajuan_status === "ditolak") {
    return (
      <span className="text-xs font-medium text-red-600">
        Ditolak — {row.catatan_admin || "kirim ulang"}
      </span>
    );
  }
  if (row.pengajuan_status === "disetujui" || row.komisi_belum_setor === 0) {
    return (
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
        Sudah lunas
      </span>
    );
  }
  return null;
}

export default function OwnerSetoranTunaiSection({
  variant = "full",
  onSubmitted,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [komisiPersen, setKomisiPersen] = useState(5);
  const [totalBelumSetor, setTotalBelumSetor] = useState(0);
  const [rows, setRows] = useState<OwnerKewajibanSetoranMonth[]>([]);
  const [tujuan, setTujuan] = useState<SetoranTujuanBayar | null>(null);
  const [submitRow, setSubmitRow] = useState<OwnerKewajibanSetoranMonth | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOwnerKewajibanSetoran(variant === "full" ? 12 : 6);
      setKomisiPersen(res.komisi_persen);
      setTotalBelumSetor(res.total_komisi_belum_setor);
      setRows(res.data);
      setTujuan(res.tujuan_bayar);
    } finally {
      setLoading(false);
    }
  }, [variant]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white py-12 text-sm text-gray-500 dark:border-white/10 dark:bg-white/[0.03]">
        <Loader2 size={18} className="animate-spin" />
        Memuat setoran bulanan...
      </div>
    );
  }

  const rowsWithCash = rows.filter((row) => row.jumlah_transaksi > 0);
  const displayRows = variant === "compact" ? rowsWithCash.slice(0, 3) : rows;

  if (variant === "compact") {
    return (
      <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white shadow-sm dark:border-amber-500/20 dark:from-amber-950/20 dark:to-transparent">
        <div className="border-b border-amber-100/80 px-5 py-4 dark:border-amber-500/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <CalendarDays size={14} />
                Setoran Komisi Tunai — 1× per Bulan
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Pisahkan {komisiPersen}% dari setiap pembayaran tunai. Total per
                bulan disetor ke platform.
              </p>
            </div>
            <Link
              href="/owner/setoran-tunai"
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Lihat Rincian Bulanan
              <ChevronRight size={14} />
            </Link>
          </div>
          {totalBelumSetor > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-100/80 px-3 py-2 text-sm font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
              <AlertTriangle size={16} />
              Total belum disetor: {formatRupiah(totalBelumSetor)}
            </div>
          )}
        </div>

        {rowsWithCash.length === 0 ? (
          <div className="px-5 py-4 text-sm text-gray-500">
            Belum ada transaksi tunai. Setoran bulanan muncul setelah ada
            pembayaran cash di venue.
          </div>
        ) : (
          <div className="divide-y divide-amber-100/80 dark:divide-amber-500/10">
            {displayRows.map((row) => (
              <div
                key={`${row.tahun}-${row.bulan}`}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {row.label}
                    {row.is_current_month && (
                      <span className="ml-2 text-xs font-normal text-cyan-600 dark:text-cyan-400">
                        (bulan ini)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {row.jumlah_transaksi} transaksi tunai
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatRupiah(row.komisi_belum_setor || row.total_komisi)}
                  </p>
                  <StatusBadge
                    status={
                      row.komisi_belum_setor > 0 ? "menunggu" : "disetor"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-white to-white shadow-sm dark:border-amber-500/20 dark:from-amber-950/25 dark:via-gray-900/40 dark:to-transparent">
        <div className="border-b border-amber-100/80 px-6 py-5 dark:border-amber-500/10">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <CalendarCheck size={14} />
            Setoran {komisiPersen}% — Sekali per Bulan
          </p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            Kewajiban Setoran Komisi Tunai
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
            Pembayaran <strong>tunai</strong> diterima langsung di venue. Dari
            setiap transaksi, sisihkan <strong>{komisiPersen}%</strong> sebagai
            komisi platform. Akumulasi satu bulan penuh disetor ke admin TA-LAP
            — biasanya di <strong>akhir bulan</strong>.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-200/60 bg-white px-4 py-3 dark:border-amber-500/15 dark:bg-white/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Belum Disetor
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
              {formatRupiah(totalBelumSetor)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Persentase per Transaksi
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{komisiPersen}%</p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Metode Terkait
            </p>
            <p className="mt-1 text-lg font-semibold">Tunai (Cash) saja</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-200/80 bg-cyan-50/50 px-5 py-4 text-sm text-cyan-900 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-100">
        <p className="inline-flex items-center gap-2 font-semibold">
          <Info size={16} />
          Cara setor ke platform
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-cyan-800/90 dark:text-cyan-100/90">
          <li>Catat setiap pembayaran tunai di menu Pesanan / Pembayaran.</li>
          <li>
            Sistem otomatis hitung {komisiPersen}% per transaksi — lihat kolom
            &quot;Belum Setor&quot; di bawah.
          </li>
          <li>
            Transfer total komisi ke rekening platform, lalu klik{" "}
            <strong>Ajukan Setoran</strong> + upload bukti.
          </li>
          <li>Admin verifikasi — Anda dapat notifikasi saat disetujui/ditolak.</li>
        </ol>
        {tujuan?.bank_account_number && (
          <div className="mt-3 rounded-lg border border-cyan-300/50 bg-white/60 p-3 dark:bg-black/20">
            <p className="font-medium">Rekening tujuan transfer</p>
            <p className="mt-1 text-xs">
              {tujuan.bank_name} · {tujuan.bank_account_number} · a/n{" "}
              {tujuan.bank_account_holder}
            </p>
            {tujuan.ewallet_note && (
              <p className="mt-1 text-xs">E-wallet: {tujuan.ewallet_note}</p>
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Rincian per Bulan
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            12 bulan terakhir — hanya transaksi pembayaran tunai
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-white/10">
                <th className="px-6 py-3 font-medium">Bulan</th>
                <th className="px-4 py-3 font-medium">Transaksi Tunai</th>
                <th className="px-4 py-3 font-medium text-right">
                  Volume Tunai
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  Komisi ({komisiPersen}%)
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  Belum Setor
                </th>
                <th className="px-6 py-3 font-medium">Status / Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr
                  key={`${row.tahun}-${row.bulan}`}
                  className={`border-b border-gray-50 dark:border-white/5 ${
                    row.is_current_month
                      ? "bg-cyan-50/50 dark:bg-cyan-500/5"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {row.label}
                    </p>
                    {row.is_current_month && (
                      <p className="text-xs text-cyan-600 dark:text-cyan-400">
                        Bulan berjalan — setor di akhir periode
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 tabular-nums">
                    {row.jumlah_transaksi || "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {row.jumlah_transaksi > 0
                      ? formatRupiah(row.total_volume_tunai)
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums font-medium">
                    {row.jumlah_transaksi > 0
                      ? formatRupiah(row.total_komisi)
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums text-amber-700 dark:text-amber-300">
                    {row.komisi_belum_setor > 0
                      ? formatRupiah(row.komisi_belum_setor)
                      : row.jumlah_transaksi > 0
                        ? "—"
                        : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <PengajuanLabel row={row} />
                    {row.can_submit && tujuan && (
                      <button
                        type="button"
                        onClick={() => setSubmitRow(row)}
                        className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500"
                      >
                        Ajukan Setoran
                      </button>
                    )}
                    {row.jumlah_transaksi === 0 && (
                      <StatusBadge status="kosong" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tujuan && submitRow && (
        <OwnerSetoranSubmitModal
          open={!!submitRow}
          row={submitRow}
          tujuan={tujuan}
          onClose={() => setSubmitRow(null)}
          onSuccess={() => {
            load();
            onSubmitted?.();
          }}
        />
      )}
    </div>
  );
}
