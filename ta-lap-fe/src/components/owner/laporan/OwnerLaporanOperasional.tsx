import {
  Building2,
  CalendarDays,
  CreditCard,
  Users,
} from "lucide-react";
import { OwnerLaporanOperasional } from "@/types/ownerLaporan";

type Props = {
  data: OwnerLaporanOperasional;
};

export default function OwnerLaporanOperasionalSection({ data }: Props) {
  const groups = [
    {
      title: "Venue",
      icon: Building2,
      items: [
        { label: "Total Lapangan", value: data.totalLapangan },
        { label: "Lapangan Aktif", value: data.lapanganAktif },
      ],
    },
    {
      title: "Pesanan",
      icon: CalendarDays,
      items: [
        { label: "Total Pesanan", value: data.totalPesanan },
        { label: "Pending", value: data.pesananPending },
        { label: "Dibayar", value: data.pesananDibayar },
        { label: "Selesai", value: data.pesananSelesai },
        { label: "Dibatalkan", value: data.pesananDibatalkan },
      ],
    },
    {
      title: "Pembayaran",
      icon: CreditCard,
      items: [
        { label: "Total Transaksi", value: data.totalTransaksi },
        { label: "Sukses", value: data.transaksiSukses },
        { label: "Menunggu", value: data.transaksiMenunggu },
        { label: "Gagal/Refund", value: data.transaksiGagalRefund },
      ],
    },
    {
      title: "Pelanggan",
      icon: Users,
      items: [{ label: "Customer Unik", value: data.totalCustomerUnik }],
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <h3 className="text-base font-semibold">Statistik Operasional Venue</h3>
        <p className="mt-1 text-xs text-gray-500">
          Ringkasan aktivitas lapangan milik Anda
        </p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="rounded-lg border border-gray-100 p-4 dark:border-white/5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className="text-cyan-600" />
                <h4 className="text-sm font-semibold">{group.title}</h4>
              </div>
              <dl className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <dt className="text-gray-500">{item.label}</dt>
                    <dd className="font-semibold tabular-nums">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
