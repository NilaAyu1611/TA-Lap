import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { TransaksiStats } from "@/types/transaksi";
import { formatRupiah } from "@/lib/auth";

type Props = {
  stats: TransaksiStats;
};

export default function PembayaranStatsSection({ stats }: Props) {
  const cards = [
    {
      label: "Pendapatan Bersih",
      value: formatRupiah(stats.totalPendapatan ?? 0),
      icon: TrendingUp,
      accent: "border-l-emerald-500",
      isText: true,
      hint: "1 booking sukses = 1 transaksi = komisi terpisah",
    },
    {
      label: "Menunggu Verifikasi",
      value: stats.menunggu,
      icon: Clock3,
      accent: "border-l-amber-500",
      hint: "Perlu konfirmasi Anda",
    },
    {
      label: "Pembayaran Sukses",
      value: stats.sukses,
      icon: CheckCircle2,
      accent: "border-l-cyan-500",
      hint: "Masing-masing booking = komisi terpisah",
    },
    {
      label: "Transaksi Hari Ini",
      value: stats.hariIni ?? 0,
      icon: Wallet,
      accent: "border-l-violet-500",
    },
    {
      label: "Komisi Belum Setor",
      value: formatRupiah(stats.totalKomisiHarusSetor ?? stats.piutangKomisi ?? 0),
      icon: AlertTriangle,
      accent: "border-l-orange-500",
      isText: true,
      hint:
        (stats.komisiBelumSetor ?? stats.komisiBelumLunas ?? 0) > 0
          ? `${stats.komisiBelumSetor ?? stats.komisiBelumLunas} transaksi tunai`
          : "Tidak ada tunggakan komisi",
    },
    {
      label: "Menunggu Pencairan",
      value: stats.payoutMenunggu,
      icon: Clock3,
      accent: "border-l-sky-500",
      hint: "Diproses admin platform",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200/80 border-l-4 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] ${card.accent}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p
                  className={`mt-1 font-semibold text-gray-900 dark:text-white ${
                    card.isText ? "text-base" : "text-2xl tabular-nums"
                  }`}
                >
                  {card.value}
                </p>
                {card.hint && (
                  <p className="mt-1 text-[11px] text-gray-500">{card.hint}</p>
                )}
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400">
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
