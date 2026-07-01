import Link from "next/link";
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

export default function TransaksiStatsSection({ stats }: Props) {
  const cards: {
    label: string;
    value: string | number;
    icon: typeof Wallet;
    accent: string;
    isText?: boolean;
    highlight?: boolean;
    hint?: string;
    href?: string;
  }[] = [
    {
      label: "Pendapatan Admin",
      value: formatRupiah(stats.pendapatanAdmin ?? stats.totalKomisi),
      icon: TrendingUp,
      accent: "border-l-emerald-500",
      isText: true,
      highlight: true,
      hint: "Komisi platform dari booking sukses",
    },
    {
      label: "Volume GMV",
      value: formatRupiah(stats.totalVolume),
      icon: Wallet,
      accent: "border-l-cyan-500",
      isText: true,
      hint: "Total uang masuk dari pemain",
    },
    {
      label: "Piutang Komisi",
      value: formatRupiah(stats.piutangKomisi ?? 0),
      icon: AlertTriangle,
      accent: "border-l-amber-500",
      isText: true,
      hint: "Owner bayar tunai, komisi belum disetor ke platform",
      href: stats.komisiBelumLunas > 0 ? "/admin/transaksi?komisi=belum_lunas" : undefined,
    },
    {
      label: "Transaksi Sukses",
      value: stats.sukses,
      icon: CheckCircle2,
      accent: "border-l-violet-500",
    },
    {
      label: "Komisi Tunai Pending",
      value: stats.komisiBelumLunas,
      icon: AlertTriangle,
      accent: "border-l-orange-500",
      hint: "Jumlah transaksi tunai belum lunas",
      href: stats.komisiBelumLunas > 0 ? "/admin/transaksi?komisi=belum_lunas" : undefined,
    },
    {
      label: "Belum Transfer ke Owner",
      value: stats.payoutMenunggu,
      icon: Clock3,
      accent: "border-l-sky-500",
      hint: "Transfer manual pendapatan owner belum ditandai selesai",
      href: stats.payoutMenunggu > 0 ? "/admin/transaksi?payout=menunggu" : undefined,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        <strong>Belum transfer ke owner</strong> = uang pemain sudah masuk platform,
        tapi pendapatan owner belum Anda tandai sudah ditransfer ke rekening mereka.
        Kelola di tabel bawah, kolom <strong>Pencairan</strong>. Laporan lengkap di{" "}
        <Link
          href="/admin/laporan"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Laporan
        </Link>
        .
      </p>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div
              className={`rounded-xl border border-gray-200/80 border-l-4 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] ${card.accent} ${
                card.highlight ? "ring-1 ring-emerald-500/15" : ""
              } ${card.href ? "transition hover:border-cyan-200 hover:shadow-md" : ""}`}
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
                  {card.href && (
                    <p className="mt-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
                      Klik untuk lihat daftar →
                    </p>
                  )}
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400">
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );

          if (card.href) {
            return (
              <Link key={card.label} href={card.href} className="block">
                {inner}
              </Link>
            );
          }

          return <div key={card.label}>{inner}</div>;
        })}
      </div>
    </div>
  );
}
