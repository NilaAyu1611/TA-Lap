"use client";

import { ReactNode } from "react";

export type TableAlign = "left" | "center" | "right";

export interface TableColumn {
  key: string;
  label: string;
  align?: TableAlign;
  width?: string;
  className?: string;
}

interface AdminTableProps {
  columns?: TableColumn[];
  headers?: string[];
  children: ReactNode;
  minWidth?: string;
}

const alignClass: Record<TableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function AdminTable({
  columns,
  headers,
  children,
  minWidth = "1100px",
}: AdminTableProps) {
  const resolvedColumns: TableColumn[] =
    columns ||
    (headers || []).map((label, i) => ({
      key: `col-${i}`,
      label,
      align: "left" as const,
    }));

  const isLegacy = !columns && !!headers;

  return (
    <div
      className={
        isLegacy
          ? "overflow-hidden rounded-[32px] border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5"
          : "overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
      }
    >
      <div className="w-full overflow-x-auto">
        <table
          className={`w-full border-collapse ${isLegacy ? "" : "table-fixed"}`}
          style={{ minWidth: isLegacy ? undefined : minWidth }}
        >
          {!isLegacy && (
            <colgroup>
              {resolvedColumns.map((col) => (
                <col key={col.key} style={{ width: col.width }} />
              ))}
            </colgroup>
          )}

          <thead>
            <tr
              className={
                isLegacy
                  ? "border-b border-gray-200 dark:border-white/10"
                  : "border-b border-gray-200/80 bg-gray-50/80 dark:border-white/10 dark:bg-white/[0.04]"
              }
            >
              {resolvedColumns.map((col) => (
                <th
                  key={col.key}
                  className={
                    isLegacy
                      ? "whitespace-nowrap px-6 py-5 text-left text-sm font-semibold"
                      : `
                        px-4 py-4
                        text-xs font-semibold uppercase tracking-wider
                        text-gray-500 dark:text-gray-400
                        align-middle
                        ${alignClass[col.align || "left"]}
                        ${col.className || ""}
                      `
                  }
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            className={isLegacy ? "" : "divide-y divide-gray-100 dark:divide-white/5"}
          >
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TableCell({
  align = "left",
  children,
  className = "",
}: {
  align?: TableAlign;
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`
        px-4 py-4
        align-middle
        text-sm
        ${alignClass[align]}
        ${className}
      `}
    >
      {children}
    </td>
  );
}
