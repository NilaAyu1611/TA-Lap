import {
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatRupiah } from "@/lib/auth";
import { OwnerLaporanRingkasan } from "@/types/ownerLaporan";

type Props = {
  ringkasan: OwnerLaporanRingkasan;
  komisiPersen: number;
};

export default function OwnerLaporanRingkasanSection({
  ringkasan,
  komisiPersen,
}: Props) {
  const cards = [
    {
      label: "Pendapatan Bersih",
      value: formatRupiah(ringkasan.pendapatanBersih),
      sub: `Setelah komisi ${komisiPersen}%`,
      icon: TrendingUp,
      accent: "border-l-emerald-500",
      highlight: true,
    },
    {
      label: "Volume Transaksi (GMV)",
      value: formatRupiah(ringkasan.volumeTransaksi),
      sub: `${ringkasan.totalBookingSukses} booking sukses — komisi per transaksi`,
      icon: Wallet,
      accent: "border-l-cyan-500",
    },
    {
      label: "Sudah Dicairkan",
      value: formatRupiah(ringkasan.payoutDicairkan),
      sub: "Transfer ke rekening owner",
      icon: Scale,
      accent: "border-l-violet-500",
      highlight: true,
    },
    {
      label: "Menunggu Pencairan",
      value: formatRupiah(ringkasan.payoutMenunggu),
      sub: "Diproses admin platform",
      icon: ArrowDownRight,
      accent: "border-l-sky-500",
    },
    {
      label: "Komisi Platform",
      value: formatRupiah(ringkasan.komisiPlatform),
      sub: `${ringkasan.komisiBelumSetorCount} transaksi tunai belum setor`,
      icon: ArrowUpRight,
      accent: "border-l-amber-500",
    },
    {
      label: "Refund Customer",
      value: formatRupiah(ringkasan.totalRefundKeCustomer),
      sub: `Potongan batal ${formatRupiah(ringkasan.totalPotonganBatal)}`,
      icon: ArrowDownRight,
      accent: "border-l-red-400",
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
