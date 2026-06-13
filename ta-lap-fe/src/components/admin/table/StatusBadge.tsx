"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  if (status === "dibayar") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          bg-green-500/10

          px-4
          py-2

          text-sm
          font-semibold
          text-green-500
        "
      >
        <CheckCircle2 size={16} />
        Dibayar
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2

          rounded-full

          bg-yellow-500/10

          px-4
          py-2

          text-sm
          font-semibold
          text-yellow-500
        "
      >
        <Clock3 size={16} />
        Pending
      </div>
    );
  }

  return (
    <div
      className="
        inline-flex
        items-center
        gap-2

        rounded-full

        bg-red-500/10

        px-4
        py-2

        text-sm
        font-semibold
        text-red-500
      "
    >
      <XCircle size={16} />
      Selesai
    </div>
  );
}