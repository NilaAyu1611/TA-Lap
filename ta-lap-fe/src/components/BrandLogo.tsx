"use client";

import Link from "next/link";

type Accent = "cyan" | "violet";
type Size = "sm" | "md" | "lg";

const ACCENTS: Record<Accent, { text: string; dot: string; bar: string }> = {
  cyan: {
    text: "from-cyan-500 via-sky-500 to-blue-600 dark:from-cyan-300 dark:via-sky-300 dark:to-blue-400",
    dot: "from-cyan-400 to-blue-500 shadow-cyan-500/40",
    bar: "from-cyan-400 via-sky-500 to-blue-600",
  },
  violet: {
    text: "from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-300 dark:via-purple-300 dark:to-fuchsia-300",
    dot: "from-violet-400 to-fuchsia-500 shadow-violet-500/40",
    bar: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
};

const SIZES: Record<Size, { word: string; dot: string; sub: string }> = {
  sm: { word: "text-lg", dot: "h-1 w-1", sub: "text-[9px]" },
  md: { word: "text-2xl", dot: "h-1.5 w-1.5", sub: "text-[10px]" },
  lg: { word: "text-3xl", dot: "h-2 w-2", sub: "text-[11px]" },
};

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
  accent?: Accent;
  size?: Size;
  className?: string;
  hideWord?: boolean;
};

export default function BrandLogo({
  href = "/",
  subtitle,
  accent = "cyan",
  size = "md",
  className = "",
  hideWord = false,
}: BrandLogoProps) {
  const a = ACCENTS[accent];
  const s = SIZES[size];

  // Compact monogram for collapsed contexts (e.g. admin sidebar)
  if (hideWord) {
    const monogram = (
      <span
        className={`font-display font-bold tracking-tight ${s.word} bg-gradient-to-r ${a.text} bg-clip-text text-transparent ${className}`}
      >
        TL
      </span>
    );
    if (!href) return monogram;
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label="TA-LAP">
        {monogram}
      </Link>
    );
  }

  const content = (
    <span className={`group inline-flex flex-col leading-none ${className}`}>
      <span className="relative flex items-center">
        <span
          className={`font-display font-bold tracking-tight ${s.word} bg-gradient-to-r ${a.text} bg-clip-text text-transparent`}
        >
          TA
        </span>

        {/* gradient dot separator instead of a plain hyphen */}
        <span
          className={`mx-[3px] mb-1 inline-block self-end rounded-full bg-gradient-to-br ${a.dot} ${s.dot} shadow-sm transition-transform duration-300 group-hover:scale-125`}
        />

        <span
          className={`font-display font-bold tracking-tight ${s.word} text-gray-900 dark:text-white`}
        >
          LAP
        </span>

        {/* animated underline that grows on hover */}
        <span
          className={`pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r ${a.bar} transition-all duration-300 group-hover:w-full`}
        />
      </span>

      {subtitle ? (
        <span
          className={`mt-1.5 font-medium uppercase tracking-[0.26em] text-gray-400 dark:text-gray-500 ${s.sub}`}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="TA-LAP">
      {content}
    </Link>
  );
}
