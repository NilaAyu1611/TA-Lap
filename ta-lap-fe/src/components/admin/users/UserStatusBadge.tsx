"use client";

import {
  Ban,
  CheckCircle2,
  PauseCircle,
  ShieldAlert,
} from "lucide-react";
import { UserStatus } from "@/types/user";

const config: Record<
  UserStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  active: {
    label: "Aktif",
    className: "bg-green-500/10 text-green-500 ring-green-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
    icon: ShieldAlert,
  },
  blocked: {
    label: "Diblokir",
    className: "bg-red-500/10 text-red-500 ring-red-500/20",
    icon: Ban,
  },
  suspended: {
    label: "Suspended",
    className: "bg-orange-500/10 text-orange-500 ring-orange-500/20",
    icon: PauseCircle,
  },
};

type Props = {
  status: UserStatus;
  size?: "sm" | "md";
};

export default function UserStatusBadge({ status, size = "md" }: Props) {
  const { label, className, icon: Icon } = config[status];
  const isSmall = size === "sm";

  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-full font-semibold ring-1
        ${isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"}
        ${className}
      `}
    >
      <Icon size={isSmall ? 12 : 14} />
      {label}
    </span>
  );
}
