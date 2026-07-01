"use client";

import { Search } from "lucide-react";
import {
  filterActiveButtonClass,
  filterInactiveButtonClass,
  filterSearchInputClass,
} from "@/components/admin/lapangan/formStyles";
import {
  TransaksiKomisiFilter,
  TransaksiPayoutFilter,
  TransaksiStatusFilter,
} from "@/types/transaksi";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: TransaksiStatusFilter;
  setStatus: (value: TransaksiStatusFilter) => void;
  komisi: TransaksiKomisiFilter;
  setKomisi: (value: TransaksiKomisiFilter) => void;
  payout: TransaksiPayoutFilter;
  setPayout: (value: TransaksiPayoutFilter) => void;
  totalCount: number;
};

const statusFilters: { value: TransaksiStatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "sukses", label: "Sukses" },
  { value: "menunggu", label: "Pending" },
  { value: "gagal", label: "Gagal/Refund" },
];

const komisiFilters: { value: TransaksiKomisiFilter; label: string }[] = [
  { value: "all", label: "Semua Komisi" },
  { value: "belum_lunas", label: "Owner Belum Setor" },
  { value: "terpotong", label: "Terpotong" },
  { value: "lunas", label: "Lunas" },
];

const payoutFilters: { value: TransaksiPayoutFilter; label: string }[] = [
  { value: "all", label: "Semua Pencairan" },
  { value: "menunggu", label: "Belum Transfer ke Owner" },
  { value: "dicairkan", label: "Sudah Transfer" },
];

export default function TransaksiFilters({
  search,
  setSearch,
  status,
  setStatus,
  komisi,
  setKomisi,
  payout,
  setPayout,
  totalCount,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode transaksi, booking, customer, owner..."
          className={filterSearchInputClass}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-gray-100 bg-gray-50/80 p-1 dark:border-white/10 dark:bg-white/[0.04]">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                status === filter.value
                  ? filterActiveButtonClass
                  : filterInactiveButtonClass
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-amber-100 bg-amber-50/50 p-1 dark:border-amber-500/20 dark:bg-amber-500/5">
          {komisiFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setKomisi(filter.value)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                komisi === filter.value
                  ? "bg-white text-amber-700 shadow-sm ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25"
                  : filterInactiveButtonClass
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-sky-100 bg-sky-50/50 p-1 dark:border-sky-500/20 dark:bg-sky-500/5">
          {payoutFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setPayout(filter.value)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                payout === filter.value
                  ? "bg-white text-sky-700 shadow-sm ring-1 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/25"
                  : filterInactiveButtonClass
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-cyan-700 dark:text-cyan-400">
          {totalCount}
        </span>{" "}
        transaksi
      </p>
    </div>
  );
}
