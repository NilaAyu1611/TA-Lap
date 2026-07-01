"use client";

import { Search } from "lucide-react";
import { filterSearchInputClass } from "@/components/admin/lapangan/formStyles";
import { PesananStatusFilter } from "@/types/pesanan";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: PesananStatusFilter;
  setStatus: (value: PesananStatusFilter) => void;
  totalCount: number;
  searchPlaceholder?: string;
};

const filters: { value: PesananStatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "dibayar", label: "Dibayar" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Batal" },
];

export default function PesananFilters({
  search,
  setSearch,
  status,
  setStatus,
  totalCount,
  searchPlaceholder = "Cari kode, customer, lapangan...",
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1 xl:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={filterSearchInputClass}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-gray-100 bg-gray-50/80 p-1 dark:border-white/10 dark:bg-white/[0.04]">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-medium transition ${
                status === filter.value
                  ? "bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-cyan-700 dark:text-cyan-400">
          {totalCount}
        </span>{" "}
        pesanan
      </p>
    </div>
  );
}
