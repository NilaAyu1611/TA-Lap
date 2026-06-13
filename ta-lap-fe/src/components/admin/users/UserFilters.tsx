"use client";

import { Search } from "lucide-react";
import { UserStatus } from "@/types/user";

type FilterStatus = "all" | UserStatus;

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: FilterStatus;
  setStatus: (value: FilterStatus) => void;
};

const filters: { value: FilterStatus; label: string; activeClass: string }[] = [
  { value: "all", label: "Semua", activeClass: "bg-cyan-500 text-white" },
  { value: "active", label: "Aktif", activeClass: "bg-green-500 text-white" },
  { value: "pending", label: "Pending", activeClass: "bg-yellow-500 text-white" },
  { value: "blocked", label: "Diblokir", activeClass: "bg-red-500 text-white" },
  {
    value: "suspended",
    label: "Suspended",
    activeClass: "bg-orange-500 text-white",
  },
];

export default function UserFilters({
  search,
  setSearch,
  status,
  setStatus,
}: Props) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/5 xl:w-[420px]">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatus(filter.value)}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              status === filter.value
                ? filter.activeClass
                : "border border-gray-300 dark:border-white/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
