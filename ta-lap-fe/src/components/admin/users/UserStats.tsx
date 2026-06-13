import {
  Ban,
  CheckCircle2,
  ShieldAlert,
  Users,
} from "lucide-react";

import StatCard from "./StatCard";

import { UserStats } from "@/types/user";

type Props = {
  stats: UserStats;
};

export default function UserStatsSection({
  stats,
}: Props) {
  const cards = [
    {
      title: "Total User",
      value: stats.total,
      icon: Users,
      iconColor: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "User Aktif",
      value: stats.active,
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending Verifikasi",
      value: stats.pending,
      icon: ShieldAlert,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "User Diblokir",
      value: stats.blocked,
      icon: Ban,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconColor={card.iconColor}
          bgColor={card.bgColor}
        />
      ))}
    </div>
  );
}