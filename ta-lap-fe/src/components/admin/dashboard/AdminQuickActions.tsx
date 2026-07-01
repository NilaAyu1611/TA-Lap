"use client";

import Link from "next/link";
import { CalendarDays, ShieldCheck, Store, Users } from "lucide-react";

const actions = [
  { href: "/admin/owners?review=pending", label: "Verifikasi Owner", icon: ShieldCheck },
  { href: "/admin/pesanan", label: "Kelola Pesanan", icon: CalendarDays },
  { href: "/admin/lapangan", label: "Kelola Lapangan", icon: Store },
  { href: "/admin/users", label: "Kelola Pemain", icon: Users },
];

export default function AdminQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
        >
          <Icon size={14} className="shrink-0 text-cyan-600 dark:text-cyan-400" />
          {label}
        </Link>
      ))}
    </div>
  );
}
