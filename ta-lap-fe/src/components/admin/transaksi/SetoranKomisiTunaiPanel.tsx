"use client";

import {
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Landmark,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { formatDate, formatRupiah } from "@/lib/auth";
import {
  getSetoranTunaiOverview,
  markSetoranTunaiDisetor,
} from "@/services/transaksi.service";
import { SetoranTunaiMonth } from "@/types/setoranTunai";

type Props = {
  onSettled?: () => void;
};

function StatusBadge({ status }: { status: SetoranTunaiMonth["status"] }) {
  const styles = {
    menunggu:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    disetor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    kosong: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400",
  };
  const labels = {
    menunggu: "Menunggu Setor",
    disetor: "Sudah Disetor",
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

export default function SetoranKomisiTunaiPanel({ onSettled }: Props) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [komisiPersen, setKomisiPersen] = useState(5);
  const [totalMenunggu, setTotalMenunggu] = useState(0);
  const [rows, setRows] = useState<SetoranTunaiMonth[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [catatanMap, setCatatanMap] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSetoranTunaiOverview(12);
      setKomisiPersen(res.komisi_persen);
      setTotalMenunggu(res.total_komisi_menunggu);
      setRows(res.data);
    } catch {
      setError("Gagal memuat data setoran komisi tunai");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSetor = async (row: SetoranTunaiMonth) => {
    const key = `${row.tahun}-${row.bulan}`;
    setSubmitting(key);
    setError("");
    try {
      await markSetoranTunaiDisetor(
        row.tahun,
        row.bulan,
        catatanMap[key] || undefined
      );
      await load();
      onSettled?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mencatat setoran";
      setError(message);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white py-10 text-sm text-gray-500 dark:border-white/10 dark:bg-white/[0.03]">
        <Loader2 size={18} className="animate-spin" />
        Memuat setoran komisi tunai...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900/40">
      <div className="border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-white px-6 py-5 dark:border-white/10 dark:from-amber-950/30 dark:to-gray-900/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Landmark size={14} />
              Setoran Komisi Tunai Bulanan
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              Akumulasi {komisiPersen}% dari Transaksi Cash
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Pembayaran tunai diterima owner di venue. Owner memisahkan{" "}
              {komisiPersen}% per transaksi. Admin kumpulkan total per bulan
              dan setorkan ke pihak terkait di akhir periode.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Total Belum Disetor
            </p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-amber-900 dark:text-amber-100">
              {formatRupiah(totalMenunggu)}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-white/10 dark:text-gray-400">
              <th className="px-6 py-3 font-medium">Periode</th>
              <th className="px-4 py-3 font-medium">Transaksi Tunai</th>
              <th className="px-4 py-3 font-medium text-right">Volume Tunai</th>
              <th className="px-4 py-3 font-medium text-right">
                Komisi ({komisiPersen}%)
              </th>
              <th className="px-4 py-3 font-medium text-right">Belum Setor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const key = `${row.tahun}-${row.bulan}`;
              const isExpanded = expanded === key;
              const canSetor =
                row.komisi_belum_setor > 0 && row.status === "menunggu";

              return (
                <Fragment key={key}>
                  <tr
                    className="border-b border-gray-50 text-gray-900 transition hover:bg-gray-50/60 dark:border-white/5 dark:text-gray-200 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {row.label}
                      </p>
                      {row.is_current_month && (
                        <p className="text-xs text-cyan-600 dark:text-cyan-400">
                          Bulan berjalan
                        </p>
                      )}
                      {row.tanggal_setor && (
                        <p className="text-xs text-gray-500">
                          Disetor: {formatDate(row.tanggal_setor)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 tabular-nums">
                      {row.jumlah_transaksi}
                      {row.transaksi_belum_setor ? (
                        <span className="block text-xs text-amber-600 dark:text-amber-400">
                          {row.transaksi_belum_setor} belum lunas
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums">
                      {formatRupiah(row.total_volume_tunai)}
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums font-medium">
                      {formatRupiah(row.total_komisi)}
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums text-amber-700 dark:text-amber-300">
                      {formatRupiah(row.komisi_belum_setor)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {row.per_owner && row.per_owner.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(isExpanded ? null : key)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                          >
                            Owner
                            {isExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </button>
                        )}
                        {canSetor && (
                          <button
                            type="button"
                            disabled={submitting === key}
                            onClick={() => handleSetor(row)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-60"
                          >
                            {submitting === key ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CalendarCheck size={14} />
                            )}
                            Catat Setoran
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && row.per_owner && (
                    <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                      <td colSpan={7} className="px-6 py-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Rincian per Owner
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {row.per_owner.map((owner) => (
                            <div
                              key={owner.owner_id}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-gray-900/60"
                            >
                              <p className="font-medium text-gray-900 dark:text-white">
                                {owner.owner_name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {owner.jumlah_transaksi} transaksi ·{" "}
                                {formatRupiah(owner.total_komisi)} komisi
                              </p>
                              {owner.komisi_belum_setor > 0 && (
                                <p className="mt-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                                  Belum setor:{" "}
                                  {formatRupiah(owner.komisi_belum_setor)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        {canSetor && (
                          <div className="mt-3 max-w-md">
                            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                              Catatan setoran (opsional)
                            </label>
                            <input
                              type="text"
                              value={catatanMap[key] || ""}
                              onChange={(e) =>
                                setCatatanMap((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              placeholder="Contoh: transfer ke rekening platform / bukti setor pajak"
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 dark:border-white/10 dark:bg-gray-950 dark:text-white"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
