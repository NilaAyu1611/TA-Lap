import {
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { LaporanRingkasan } from "@/types/laporan";

type Props = {
  ringkasan: LaporanRingkasan;
  komisiPersen: number;
};

export default function LaporanRingkasanSection({
  ringkasan,
  komisiPersen,
}: Props) {
  const cards = [
    {
      label: "Pendapatan Admin",
      value: formatRupiah(ringkasan.pendapatanAdmin),
      sub: `Komisi ${komisiPersen}% terkumpul`,
      icon: TrendingUp,
      accent: "border-l-emerald-500",
      highlight: true,
    },
    {
      label: "Laba Bersih",
      value: formatRupiah(ringkasan.labaBersih),
      sub: "Pemasukan − pengeluaran",
      icon: Scale,
      accent: "border-l-violet-500",
      highlight: true,
    },
    {
      label: "Volume Transaksi (GMV)",
      value: formatRupiah(ringkasan.volumeTransaksi),
      sub: `${ringkasan.totalBookingSukses} booking sukses`,
      icon: Wallet,
      accent: "border-l-cyan-500",
    },
    {
      label: "Total Pengeluaran",
      value: formatRupiah(ringkasan.totalPengeluaran),
      sub: "Refund + operasional",
      icon: TrendingDown,
      accent: "border-l-red-500",
    },
    {
      label: "Piutang Komisi",
      value: formatRupiah(ringkasan.piutangKomisi),
      sub: `${ringkasan.ownerBelumBayarKomisi} owner belum setor`,
      icon: ArrowUpRight,
      accent: "border-l-amber-500",
    },
    {
      label: "Kewajiban Payout Owner",
      value: formatRupiah(ringkasan.kewajibanPayout),
      sub: "Belum dicairkan ke owner",
      icon: ArrowDownRight,
      accent: "border-l-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200/80 border-l-4 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] ${card.accent} ${
              card.highlight ? "ring-1 ring-emerald-500/10" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {card.label}
                </p>
                <p
                  className={`mt-1 font-semibold text-gray-900 dark:text-white ${
                    card.highlight ? "text-xl" : "text-lg"
                  }`}
                >
                  {card.value}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">{card.sub}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
