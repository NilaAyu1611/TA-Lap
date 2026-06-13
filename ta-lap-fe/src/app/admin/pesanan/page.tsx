"use client";

import { useEffect, useState } from "react";

import AdminTable from "@/components/admin/table/AdminTable";
import StatusBadge from "@/components/admin/table/StatusBadge";
import TableAction from "@/components/admin/table/TableAction";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  Filter,
  Search,
  User2,
  XCircle,
} from "lucide-react";
import { getAllPesanan } from "@/services/pesanan.service";
import { formatDate, formatRupiah, formatTime } from "@/lib/auth";

type PesananRow = {
  id: string;
  kode_booking?: string;
  status: string;
  total_harga: number | string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  user?: { name: string };
  lapangan?: { nama: string; owner?: { name: string } };
  pembayaran?: { metode: string };
};

export default function AdminPesananPage() {
  const [pesananData, setPesananData] = useState<PesananRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPesanan();
        setPesananData(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-cyan-500">
          ADMIN PESANAN
        </p>

        <h1
          className="
            mt-2
            text-4xl
            font-black
            tracking-tight
          "
        >
          Manajemen Pesanan
        </h1>

        <p
          className="
            mt-3
            max-w-3xl

            text-gray-500
            dark:text-gray-400
          "
        >
          Kelola seluruh aktivitas booking pelanggan,
          status pembayaran, dan monitoring transaksi
          pemesanan lapangan secara realtime.
        </p>
      </div>

      {/* STATS */}
      <div
        className="
          grid
          gap-6

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Total Pesanan
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                1.240
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-cyan-500/10
              "
            >
              <CalendarDays className="text-cyan-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Pending
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                84
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-yellow-500/10
              "
            >
              <Clock3 className="text-yellow-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Dibayar
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                982
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-green-500/10
              "
            >
              <CheckCircle2 className="text-green-500" />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            p-6
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Selesai
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                "
              >
                756
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-red-500/10
              "
            >
              <XCircle className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div
        className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* SEARCH */}
        <div
          className="
            flex
            items-center
            gap-3

            rounded-2xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-white/5

            px-4
            py-3

            lg:w-[400px]
          "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari pesanan..."
            className="
              w-full
              bg-transparent
              outline-none

              placeholder:text-gray-400
            "
          />
        </div>

        {/* ACTION */}
        <div className="flex gap-3">
          <button
            className="
              flex
              items-center
              gap-2

              rounded-2xl

              border
              border-gray-300
              dark:border-white/10

              bg-white
              dark:bg-white/5

              px-5
              py-3

              text-sm
              font-medium
            "
          >
            <Filter size={18} />
            Filter
          </button>

          <button
            className="
              rounded-2xl

              bg-cyan-500

              px-5
              py-3

              text-sm
              font-semibold
              text-white

              transition
              hover:bg-cyan-400
            "
          >
            Export Data
          </button>
        </div>
      </div>

      {/* TABLE */}
      <AdminTable
  headers={[
    "Customer",
    "Owner",
    "Lapangan",
    "Tanggal",
    "Pembayaran",
    "Total",
    "Status",
    "Aksi",
  ]}
>
  {loading && (
    <tr>
      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
        Memuat pesanan...
      </td>
    </tr>
  )}
  {!loading && pesananData.length === 0 && (
    <tr>
      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
        Belum ada pesanan.
      </td>
    </tr>
  )}
  {pesananData.map((item) => (
    <tr
      key={item.id}
      className="
        border-b
        border-gray-200
        dark:border-white/5

        transition
        hover:bg-gray-100/70
        dark:hover:bg-white/[0.03]
      "
    >
      {/* CUSTOMER */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-2xl

              bg-cyan-500/10
            "
          >
            <User2 className="text-cyan-500" />
          </div>

          <div>
            <h3 className="font-semibold">
              {item.user?.name || "-"}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              User Booking
            </p>
          </div>
        </div>
      </td>

      {/* OWNER */}
      <td className="px-6 py-5 whitespace-nowrap">
        {item.lapangan?.owner?.name || "-"}
      </td>

      {/* LAPANGAN */}
      <td className="px-6 py-5 whitespace-nowrap">
        {item.lapangan?.nama || "-"}
      </td>

      {/* DATE */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {formatDate(item.tanggal_booking)}
          </div>

          <p className="text-sm text-gray-500">
            {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}
          </p>
        </div>
      </td>

      {/* PAYMENT */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-xl

            bg-gray-100
            dark:bg-white/5

            px-4
            py-2

            text-sm
          "
        >
          <CreditCard size={16} />
          {item.pembayaran?.metode || "-"}
        </div>
      </td>

      {/* TOTAL */}
      <td
        className="
          px-6
          py-5

          font-bold
          whitespace-nowrap
        "
      >
        {formatRupiah(item.total_harga)}
      </td>

      {/* STATUS */}
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>

      {/* ACTION */}
      <td className="px-6 py-5 whitespace-nowrap">
        <TableAction />
      </td>
    </tr>
  ))}
</AdminTable>
    </div>
  );
}