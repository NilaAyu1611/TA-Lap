"use client";

import { Database, Loader2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/auth";
import { BackupLogEntry } from "@/types/settings";

type Props = {
  backups: BackupLogEntry[];
  onBackup: () => Promise<string>;
  backingUp?: boolean;
};

export default function SettingsBackupSection({
  backups,
  onBackup,
  backingUp,
}: Props) {
  const latest = backups[0];

  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <Database size={20} className="text-emerald-600 dark:text-emerald-400" />
        <div>
          <h3 className="text-base font-semibold">Backup Sistem</h3>
          <p className="text-xs text-gray-500">Arsip snapshot konfigurasi & ringkasan data</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {latest ? (
          <>
            Backup terakhir:{" "}
            <strong className="text-gray-900 dark:text-white">
              {formatDate(latest.created_at)}, {formatTime(latest.created_at)}
            </strong>
            {latest.size ? ` · ${latest.size}` : ""}
          </>
        ) : (
          "Belum ada backup tercatat."
        )}
      </p>

      <button
        type="button"
        onClick={onBackup}
        disabled={backingUp}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {backingUp ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Database size={16} />
        )}
        Backup Sekarang
      </button>

      {backups.length > 0 && (
        <div className="mt-5 max-h-48 space-y-2 overflow-y-auto">
          {backups.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-xs dark:border-white/5"
            >
              <div className="min-w-0">
                <p className="truncate font-mono">{item.file_name}</p>
                <p className="text-gray-500">
                  {formatDate(item.created_at)} · {item.size || "—"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-semibold capitalize ${
                  item.status === "success"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                }`}
              >
                {item.status || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
