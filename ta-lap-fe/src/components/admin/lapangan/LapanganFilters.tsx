"use client";

import { Search } from "lucide-react";
import {
  filterSearchInputClass,
} from "@/components/admin/lapangan/formStyles";
import { formatJenisLabel } from "@/lib/jenis";
import { LapanganStatusFilter } from "@/types/lapangan";
import { JenisOlahraga } from "@/types/jenis";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: LapanganStatusFilter;
  setStatus: (value: LapanganStatusFilter) => void;
  jenis: string;
  setJenis: (value: string) => void;
  totalCount: number;
  jenisOptions?: JenisOlahraga[];
  searchPlaceholder?: string;
};

const statusFilters: { value: LapanganStatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

const jenisFilters = [
  { value: "all", label: "Semua Jenis" },
  { value: "futsal", label: "Futsal" },
  { value: "badminton", label: "Badminton" },
];

export default function LapanganFilters({
  search,
  setSearch,
  status,
  setStatus,
  jenis,
  setJenis,
  totalCount,
  jenisOptions,
  searchPlaceholder = "Cari nama, kota, owner...",
}: Props) {
  const jenisSelectOptions = jenisOptions?.length
    ? [
        { value: "all", label: "Semua Jenis" },
        ...jenisOptions.map((item) => ({
          value: item.nama,
          label: item.label || formatJenisLabel(item.nama),
        })),
      ]
    : jenisFilters;
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/80 p-1 dark:border-white/10 dark:bg-white/[0.04]">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                  status === filter.value
                    ? "bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-white/[0.04]"
          >
            {jenisSelectOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-cyan-700 dark:text-cyan-400">
          {totalCount}
        </span>{" "}
        lapangan
      </p>
    </div>
  );
}
