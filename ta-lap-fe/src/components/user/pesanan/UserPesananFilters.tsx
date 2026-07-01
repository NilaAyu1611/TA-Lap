"use client";

import { Search, X } from "lucide-react";
import {
  USER_PESANAN_STATUS_OPTIONS,
  UserPesananStatusFilter,
} from "@/lib/userPesananFilter";

type Props = {
  search: string;
  status: UserPesananStatusFilter;
  resultCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: UserPesananStatusFilter) => void;
  onReset: () => void;
};

export default function UserPesananFilters({
  search,
  status,
  resultCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onReset,
}: Props) {
  const hasActiveFilter = search.trim() !== "" || status !== "all";

  return (
    <div className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode booking, nama lapangan, jenis..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-gray-900/40"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
              aria-label="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <strong className="text-gray-800 dark:text-gray-200">
            {resultCount}
          </strong>{" "}
          dari {totalCount} pesanan
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {USER_PESANAN_STATUS_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onStatusChange(id)}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
              status === id
                ? "bg-cyan-600 text-white"
                : "bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
        >
          Reset pencarian & filter
        </button>
      )}
    </div>
  );
}
