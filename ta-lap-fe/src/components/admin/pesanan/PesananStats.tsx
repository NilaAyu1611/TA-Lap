import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Wallet,
} from "lucide-react";
import { PesananStats } from "@/types/pesanan";
import { formatRupiah } from "@/lib/auth";

type Props = {
  stats: PesananStats;
};

export default function PesananStatsSection({ stats }: Props) {
  const cards = [
    {
      label: "Total Pesanan",
      value: stats.total,
      icon: CalendarDays,
      accent: "border-l-cyan-500 bg-gradient-to-br from-cyan-50/80 to-white",
      iconBg: "bg-cyan-100 text-cyan-600",
      darkAccent:
        "dark:border-l-cyan-500 dark:from-cyan-950/40 dark:to-gray-900/80",
      darkIcon: "dark:bg-cyan-500/15 dark:text-cyan-400",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock3,
      accent: "border-l-amber-500 bg-gradient-to-br from-amber-50/80 to-white",
      iconBg: "bg-amber-100 text-amber-600",
      darkAccent:
        "dark:border-l-amber-500 dark:from-amber-950/40 dark:to-gray-900/80",
      darkIcon: "dark:bg-amber-500/15 dark:text-amber-400",
    },
    {
      label: "Dibayar",
      value: stats.dibayar,
      icon: CheckCircle2,
      accent:
        "border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white",
      iconBg: "bg-emerald-100 text-emerald-600",
      darkAccent:
        "dark:border-l-emerald-500 dark:from-emerald-950/40 dark:to-gray-900/80",
      darkIcon: "dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
      label: "Pendapatan",
      value: formatRupiah(stats.totalRevenue),
      icon: Wallet,
      isText: true,
      accent: "border-l-violet-500 bg-gradient-to-br from-violet-50/80 to-white",
      iconBg: "bg-violet-100 text-violet-600",
      darkAccent:
        "dark:border-l-violet-500 dark:from-violet-950/40 dark:to-gray-900/80",
      darkIcon: "dark:bg-violet-500/15 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200/80 border-l-4 px-4 py-4 shadow-sm ${card.accent} ${card.darkAccent}`}
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
              </div>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconBg} ${card.darkIcon}`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
