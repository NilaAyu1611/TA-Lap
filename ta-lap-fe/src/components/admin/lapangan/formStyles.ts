export const formLabelClass =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

export const formInputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-white/15 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-cyan-500/60 dark:[color-scheme:dark]";

export const formSelectClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-white/15 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-500/60 dark:[color-scheme:dark]";

export const formTextareaClass = formInputClass + " resize-none";

export const filterSearchInputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/15 dark:border-white/15 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-cyan-500/60 dark:focus:bg-gray-800 dark:focus:ring-cyan-500/20 dark:[color-scheme:dark]";

export const filterActiveButtonClass =
  "bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20";

export const filterInactiveButtonClass =
  "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200";

export function toTimeInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}/.test(trimmed)) return trimmed.slice(0, 5);

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
