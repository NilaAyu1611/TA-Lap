"use client";

import { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
}

export default function AdminTable({
  headers,
  children,
}: AdminTableProps) {
  return (
    <div
      className="
        overflow-hidden

        rounded-[32px]

        border
        border-gray-200
        dark:border-white/10

        bg-white
        dark:bg-white/5
      "
    >
      {/* RESPONSIVE */}
      <div className="w-full overflow-x-auto">
        {/* MIN WIDTH TABLE */}
        <div className="min-w-[1000px]">
          <table className="w-full">
            {/* HEADER */}
            <thead
              className="
                border-b
                border-gray-200
                dark:border-white/10
              "
            >
              <tr>
                {headers.map((item) => (
                  <th
                    key={item}
                    className="
                      px-6
                      py-5
                      text-left

                      text-sm
                      font-semibold

                      whitespace-nowrap
                    "
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}