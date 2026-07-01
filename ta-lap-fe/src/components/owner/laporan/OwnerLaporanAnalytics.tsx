import { formatRupiah } from "@/lib/auth";
import { formatMetodePembayaran } from "@/lib/pembayaran";
import { OwnerPerJenis, OwnerPerMetode, OwnerTopLapangan } from "@/types/ownerLaporan";

export function OwnerTopLapanganSection({ data }: { data: OwnerTopLapangan[] }) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
        <h3 className="text-sm font-semibold">Performa per Lapangan</h3>
        <p className="text-xs text-gray-500">Ranking berdasarkan pendapatan bersih</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs uppercase text-gray-500 dark:border-white/5">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Lapangan</th>
              <th className="px-4 py-3">Jenis</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Volume</th>
              <th className="px-4 py-3">Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.map((row, idx) => (
              <tr key={row.lapangan_id}>
                <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3 font-medium">{row.nama}</td>
                <td className="px-4 py-3 capitalize text-gray-500">{row.jenis || "—"}</td>
                <td className="px-4 py-3">{row.booking}</td>
                <td className="px-4 py-3">{formatRupiah(row.volume)}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">
                  {formatRupiah(row.pendapatanOwner)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OwnerPerMetodeSection({ data }: { data: OwnerPerMetode[] }) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="text-sm font-semibold">Per Metode Pembayaran</h3>
      <div className="mt-3 space-y-2">
        {data.map((row) => (
          <div
            key={row.metode}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-white/5"
          >
            <span>{formatMetodePembayaran(row.metode)}</span>
            <div className="text-right">
              <p className="font-semibold">{formatRupiah(row.pendapatanOwner)}</p>
              <p className="text-xs text-gray-500">{row.count} transaksi</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OwnerPerJenisSection({ data }: { data: OwnerPerJenis[] }) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h3 className="text-sm font-semibold">Per Jenis Olahraga</h3>
      <div className="mt-3 space-y-2">
        {data.map((row) => (
          <div
            key={row.jenis}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-white/5"
          >
            <span className="capitalize">{row.jenis}</span>
            <div className="text-right">
              <p className="font-semibold">{formatRupiah(row.pendapatanOwner)}</p>
              <p className="text-xs text-gray-500">{row.count} booking</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
