"use client";

import { Eye } from "lucide-react";

export default function TableAction() {
  return (
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

          px-4
          py-2

          text-sm
          font-medium

          transition

          hover:border-cyan-500
          hover:text-cyan-500
        "
      >
        <Eye size={16} />
        Detail
      </button>

      <button
        className="
          rounded-2xl

          bg-cyan-500

          px-4
          py-2

          text-sm
          font-semibold
          text-white

          transition
          hover:bg-cyan-400
        "
      >
        Kelola
      </button>
    </div>
  );
}