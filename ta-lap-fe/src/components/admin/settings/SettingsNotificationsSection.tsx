"use client";

import { Bell } from "lucide-react";
import SettingsToggle from "@/components/admin/settings/SettingsToggle";
import { SettingsFormData } from "@/types/settings";

const items: {
  key: keyof Pick<
    SettingsFormData,
    | "booking_notification"
    | "owner_notification"
    | "payment_notification"
    | "backup_notification"
  >;
  title: string;
  description: string;
}[] = [
  {
    key: "booking_notification",
    title: "Booking baru masuk",
    description: "Notifikasi saat customer membuat pesanan",
  },
  {
    key: "owner_notification",
    title: "Owner baru mendaftar",
    description: "Notifikasi verifikasi owner baru",
  },
  {
    key: "payment_notification",
    title: "Pembayaran berhasil",
    description: "Notifikasi transaksi sukses",
  },
  {
    key: "backup_notification",
    title: "Backup database selesai",
    description: "Notifikasi setelah backup sistem",
  },
];

type Props = {
  form: SettingsFormData;
  onChange: (patch: Partial<SettingsFormData>) => void;
};

export default function SettingsNotificationsSection({ form, onChange }: Props) {
  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <Bell size={20} className="text-amber-500" />
        <div>
          <h3 className="text-base font-semibold">Notifikasi Sistem</h3>
          <p className="text-xs text-gray-500">Kelola alert platform</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-3.5 dark:border-white/10"
          >
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
            <SettingsToggle
              enabled={form[item.key]}
              onChange={(value) => onChange({ [item.key]: value })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
