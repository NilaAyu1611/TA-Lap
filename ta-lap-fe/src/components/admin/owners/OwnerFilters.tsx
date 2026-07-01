"use client";

import { Search } from "lucide-react";
import { filterSearchInputClass } from "@/components/admin/lapangan/formStyles";
import { OwnerActivityFilter, OwnerStatus } from "@/types/owner";

type FilterStatus = "all" | OwnerStatus;

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: FilterStatus;
  setStatus: (value: FilterStatus) => void;
  activity: OwnerActivityFilter;
  setActivity: (value: OwnerActivityFilter) => void;
  totalCount: number;
};

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "pending", label: "Pending" },
  { value: "blocked", label: "Diblokir" },
];

const activityFilters: {
  value: OwnerActivityFilter;
  label: string;
  hint: string;
}[] = [
  {
    value: "all",
    label: "Semua Performa",
    hint: "Tampilkan seluruh owner",
  },
  {
    value: "menunggu_verifikasi",
    label: "Menunggu Verifikasi",
    hint: "Pendaftaran owner baru dari website — perlu disetujui admin",
  },
  {
    value: "sudah_laku",
    label: "Sudah Laku",
    hint: "Minimal 1 transaksi/pembayaran sukses",
  },
  {
    value: "belum_laku",
    label: "Belum Laku",
    hint: "Punya lapangan tapi belum ada transaksi sukses",
  },
  {
    value: "tanpa_lapangan",
    label: "Tanpa Lapangan",
    hint: "Belum punya venue sama sekali",
  },
];

export default function OwnerFilters({
  search,
  setSearch,
  status,
  setStatus,
  activity,
  setActivity,
  totalCount,
}: Props) {
  const activeHint = activityFilters.find((f) => f.value === activity)?.hint;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau kota..."
              className={filterSearchInputClass}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-gray-100 bg-gray-50/80 p-1 dark:border-white/10 dark:bg-white/[0.04]">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-medium transition ${
                  status === filter.value
                    ? "bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Filter Performa Bisnis
          </p>
          <div className="flex flex-wrap gap-2">
            {activityFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActivity(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activity === filter.value
                    ? filter.value === "menunggu_verifikasi"
                      ? "bg-violet-600 text-white"
                      : filter.value === "belum_laku"
                      ? "bg-amber-600 text-white"
                      : filter.value === "sudah_laku"
                        ? "bg-emerald-600 text-white"
                        : "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          {activeHint && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {activeHint}
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-cyan-700 dark:text-cyan-400">
          {totalCount}
        </span>{" "}
        owner
      </p>
    </div>
  );
}

export function matchesOwnerActivity(
  owner: {
    status: string;
    verificationStatus: string | null;
    totalLapangan: number;
    transaksiSukses: number;
  },
  activity: OwnerActivityFilter
) {
  switch (activity) {
    case "menunggu_verifikasi":
      return owner.status === "pending" && owner.verificationStatus === "pending";
    case "sudah_laku":
      return owner.transaksiSukses > 0;
    case "belum_laku":
      return owner.totalLapangan > 0 && owner.transaksiSukses === 0;
    case "tanpa_lapangan":
      return owner.totalLapangan === 0;
    default:
      return true;
  }
}
