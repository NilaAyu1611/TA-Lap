"use client";

import { Store, User2 } from "lucide-react";

type Props = {
  businessName?: string | null;
  ownerName?: string | null;
  compact?: boolean;
};

/** Tampilan operator venue ke pemain — brand usaha + PIC. */
export default function VenueOperatorLine({
  businessName,
  ownerName,
  compact,
}: Props) {
  const brand = businessName?.trim();
  const pic = ownerName?.trim();

  if (!brand && !pic) return null;

  if (compact) {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {brand ? (
          <>
            <Store size={12} className="mr-1 inline -mt-0.5" />
            {brand}
          </>
        ) : (
          pic
        )}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
      <span className="text-gray-500">Operator:</span>
      {brand && (
        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-200">
          <Store size={14} className="text-violet-600 dark:text-violet-400" />
          {brand}
        </span>
      )}
      {brand && pic && (
        <span className="text-gray-400" aria-hidden>
          ·
        </span>
      )}
      {pic && (
        <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <User2 size={13} />
          PIC {pic}
        </span>
      )}
    </div>
  );
}
