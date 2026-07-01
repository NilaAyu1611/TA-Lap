import {
  AlertCircle,
  Building2,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { LapanganStats } from "@/types/lapangan";

type Props = {
  stats: LapanganStats;
  variant?: "admin" | "owner";
};

const adminCards = [
  {
    label: "Total Lapangan",
    valueKey: "total" as const,
    icon: Building2,
    accent: "border-l-cyan-500 bg-gradient-to-br from-cyan-50/80 to-white",
    iconBg: "bg-cyan-100 text-cyan-600",
    darkAccent:
      "dark:border-l-cyan-500 dark:from-cyan-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-cyan-500/15 dark:text-cyan-400",
  },
  {
    label: "Aktif",
    valueKey: "aktif" as const,
    icon: CheckCircle2,
    accent: "border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white",
    iconBg: "bg-emerald-100 text-emerald-600",
    darkAccent:
      "dark:border-l-emerald-500 dark:from-emerald-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    label: "Nonaktif",
    valueKey: "nonaktif" as const,
    icon: AlertCircle,
    accent: "border-l-amber-500 bg-gradient-to-br from-amber-50/80 to-white",
    iconBg: "bg-amber-100 text-amber-600",
    darkAccent:
      "dark:border-l-amber-500 dark:from-amber-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    label: "Tanpa Owner",
    valueKey: "tanpaOwner" as const,
    icon: MapPin,
    accent: "border-l-violet-500 bg-gradient-to-br from-violet-50/80 to-white",
    iconBg: "bg-violet-100 text-violet-600",
    darkAccent:
      "dark:border-l-violet-500 dark:from-violet-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-violet-500/15 dark:text-violet-400",
  },
];

const ownerCards = [
  {
    label: "Total Lapangan",
    valueKey: "total" as const,
    icon: Building2,
    accent: "border-l-cyan-500 bg-gradient-to-br from-cyan-50/80 to-white",
    iconBg: "bg-cyan-100 text-cyan-600",
    darkAccent:
      "dark:border-l-cyan-500 dark:from-cyan-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-cyan-500/15 dark:text-cyan-400",
  },
  {
    label: "Aktif",
    valueKey: "aktif" as const,
    icon: CheckCircle2,
    accent: "border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white",
    iconBg: "bg-emerald-100 text-emerald-600",
    darkAccent:
      "dark:border-l-emerald-500 dark:from-emerald-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    label: "Nonaktif",
    valueKey: "nonaktif" as const,
    icon: AlertCircle,
    accent: "border-l-amber-500 bg-gradient-to-br from-amber-50/80 to-white",
    iconBg: "bg-amber-100 text-amber-600",
    darkAccent:
      "dark:border-l-amber-500 dark:from-amber-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    label: "Total Booking",
    valueKey: "totalBooking" as const,
    icon: MapPin,
    accent: "border-l-violet-500 bg-gradient-to-br from-violet-50/80 to-white",
    iconBg: "bg-violet-100 text-violet-600",
    darkAccent:
      "dark:border-l-violet-500 dark:from-violet-950/40 dark:to-gray-900/80",
    darkIcon: "dark:bg-violet-500/15 dark:text-violet-400",
  },
];

export default function LapanganStatsSection({
  stats,
  variant = "admin",
}: Props) {
  const cards = variant === "owner" ? ownerCards : adminCards;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200/80 border-l-4 px-4 py-4 shadow-sm ${card.accent} ${card.darkAccent}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-white">
                  {stats[card.valueKey] ?? 0}
                </p>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg} ${card.darkIcon}`}
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
