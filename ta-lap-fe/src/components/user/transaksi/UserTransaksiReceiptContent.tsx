import BrandLogo from "@/components/BrandLogo";
import TransaksiStatusBadge from "@/components/admin/transaksi/TransaksiStatusBadge";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { Transaksi } from "@/types/transaksi";

type Props = {
  transaksi: Transaksi;
};

export default function UserTransaksiReceiptContent({ transaksi }: Props) {
  return (
    <div className="space-y-6 px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <BrandLogo subtitle="Bukti Pembayaran" accent="cyan" />
        <TransaksiStatusBadge status={transaksi.status} />
      </div>

      <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Kode Transaksi
        </p>
        <p className="mt-1 font-mono text-xl font-bold text-cyan-700 dark:text-cyan-400">
          {transaksi.kode_transaksi}
        </p>
      </div>

      <div className="grid gap-3 text-sm">
        <Row label="Kode Booking" value={transaksi.kode_booking || "—"} mono />
        <Row label="Lapangan" value={transaksi.lapangan_nama || "—"} />
        <Row label="Jenis" value={transaksi.lapangan_jenis || "—"} />
        <Row
          label="Tanggal Main"
          value={
            transaksi.tanggal_booking
              ? `${formatDate(transaksi.tanggal_booking)} · ${formatTime(transaksi.jam_mulai)} - ${formatTime(transaksi.jam_selesai)}`
              : "—"
          }
        />
        <Row
          label="Metode Bayar"
          value={formatMetodePembayaran(transaksi.metode)}
        />
        <Row
          label="Tanggal Bayar"
          value={
            transaksi.tanggal_bayar ? formatDate(transaksi.tanggal_bayar) : "—"
          }
        />
      </div>

      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Dibayar
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(transaksi.total_bayar)}
          </span>
        </div>
      </div>

      {transaksi.status === "sukses" && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Pembayaran terverifikasi otomatis. Struk ini khusus transaksi{" "}
          <strong className="font-mono">{transaksi.kode_transaksi}</strong>.
        </p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2 dark:border-white/5">
      <span className="shrink-0 text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-right font-medium ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
