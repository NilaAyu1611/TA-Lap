"use client";

import { MapPin, Store, User2 } from "lucide-react";

type Variant = "compact" | "full" | "owner-form";

type Props = {
  variant?: Variant;
  className?: string;
  /** Contoh nama brand — untuk preview di form */
  businessPreview?: string;
  /** Contoh nama lapangan — untuk preview di form */
  venuePreview?: string;
};

export default function VenueHierarchyGuide({
  variant = "compact",
  className = "",
  businessPreview,
  venuePreview,
}: Props) {
  if (variant === "owner-form") {
    return (
      <div
        className={`rounded-xl border border-cyan-200/80 bg-cyan-50/60 p-4 dark:border-cyan-500/25 dark:bg-cyan-500/5 ${className}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
          Preview tampilan ke pemain
        </p>
        <div className="mt-3 space-y-2">
          <PreviewRow
            icon={MapPin}
            label="Judul halaman booking"
            value={venuePreview?.trim() || "Nama lapangan Anda"}
            highlight
          />
          {businessPreview?.trim() && (
            <PreviewRow
              icon={Store}
              label="Operator venue"
              value={businessPreview.trim()}
            />
          )}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
          <strong>Nama lapangan</strong> = listing yang dicari & dibooking user.
          Brand bisnis dikelola di{" "}
          <span className="font-medium text-cyan-700 dark:text-cyan-400">
            Profil & Bisnis
          </span>
          .
        </p>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div
        className={`rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-5 dark:border-violet-500/25 dark:from-violet-950/30 dark:to-transparent ${className}`}
      >
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
          Struktur data venue di TA-Lap
        </p>
        <p className="mt-1 text-xs text-violet-800/80 dark:text-violet-200/80">
          Tiga level berbeda — jangan dicampur agar pemain & admin tidak bingung.
        </p>
        <div className="mt-4 space-y-0">
          <HierarchyStep
            icon={User2}
            step="1"
            title="Penanggung jawab (PIC)"
            desc="Nama orang yang login & verifikasi admin."
            example="Budi Santoso"
            tone="gray"
          />
          <Connector />
          <HierarchyStep
            icon={Store}
            step="2"
            title="Brand / nama usaha"
            desc="Identitas bisnis — 1 akun owner, 1 brand."
            example="Arena Sport Bandung"
            tone="violet"
          />
          <Connector />
          <HierarchyStep
            icon={MapPin}
            step="3"
            title="Nama lapangan (listing)"
            desc="Setiap venue/court — bisa banyak, tampil ke pemain."
            example="Futsal Court A · Badminton Hall 2"
            tone="cyan"
            last
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400 ${className}`}
    >
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        Brand usaha
      </span>{" "}
      (profil owner) ≠{" "}
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        nama lapangan
      </span>{" "}
      (listing booking). Satu brand bisa punya banyak lapangan — tambahkan
      lapangan setelah akun disetujui.
    </div>
  );
}

function HierarchyStep({
  icon: Icon,
  step,
  title,
  desc,
  example,
  tone,
  last,
}: {
  icon: typeof User2;
  step: string;
  title: string;
  desc: string;
  example: string;
  tone: "gray" | "violet" | "cyan";
  last?: boolean;
}) {
  const tones = {
    gray: "border-gray-200 bg-white dark:border-white/10 dark:bg-white/5",
    violet: "border-violet-200 bg-violet-50/50 dark:border-violet-500/25 dark:bg-violet-500/5",
    cyan: "border-cyan-200 bg-cyan-50/50 dark:border-cyan-500/25 dark:bg-cyan-500/5",
  };
  const iconTones = {
    gray: "bg-gray-100 text-gray-600 dark:bg-white/10",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
    cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  };

  return (
    <div className={`rounded-xl border p-3 ${tones[tone]} ${last ? "" : ""}`}>
      <div className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconTones[tone]}`}
        >
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Langkah {step}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{desc}</p>
          <p className="mt-1.5 text-xs">
            <span className="text-gray-500">Contoh: </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {example}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="ml-7 flex h-4 items-center border-l-2 border-dashed border-gray-300 dark:border-white/15" />
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
        highlight
          ? "bg-white ring-1 ring-cyan-200 dark:bg-gray-900 dark:ring-cyan-500/30"
          : "bg-white/60 dark:bg-white/5"
      }`}
    >
      <Icon size={14} className="mt-0.5 shrink-0 text-cyan-600" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
      {children}
    </p>
  );
}
