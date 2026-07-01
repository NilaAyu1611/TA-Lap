"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  Info,
  Layers,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeInit from "@/components/admin/ThemeInit";

const NAV_LINKS = [
  { href: "#lapangan", label: "Lapangan", icon: MapPin },
  { href: "#fitur", label: "Layanan", icon: Layers },
  { href: "#pemain", label: "Cara Booking", icon: CalendarDays },
  { href: "#owner", label: "Mitra Venue", icon: Building2 },
  { href: "#tentang", label: "Tentang Kami", icon: Info },
] as const;

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ThemeInit />
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "border-b border-gray-200/90 bg-white/90 shadow-sm shadow-gray-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b14]/92 dark:shadow-black/20"
              : "border-b border-transparent bg-white/70 backdrop-blur-md dark:bg-[#060b14]/70"
          }
        `}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* LOGO */}
          <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 opacity-40 blur-md transition group-hover:opacity-60 dark:opacity-50" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-400 to-violet-600 shadow-lg shadow-cyan-500/30 ring-1 ring-white/60 dark:ring-white/20">
                <span className="font-display text-lg font-black tracking-tighter text-white">
                  T
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="font-display block text-xl font-extrabold leading-none tracking-tight sm:text-[1.35rem]">
                <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-300 dark:to-violet-400">
                  TA-LAP
                </span>
              </span>
              <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Booking Lapangan
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 rounded-2xl border border-gray-200/70 bg-gray-100/60 p-1.5 lg:flex dark:border-white/10 dark:bg-white/[0.04]">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="
                  group flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold
                  text-gray-600 transition-all duration-200
                  hover:bg-white hover:text-cyan-600 hover:shadow-md hover:shadow-cyan-100/80
                  dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-cyan-300 dark:hover:shadow-none
                "
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/0 text-gray-400 transition group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-400">
                  <Icon size={15} strokeWidth={2.25} />
                </span>
                {label}
              </a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5 md:inline-block"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="hidden rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-cyan-400 hover:shadow-cyan-400/30 sm:inline-block"
            >
              Daftar
            </Link>
            <Link
              href="/register/owner"
              className="hidden rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50 to-violet-100/80 px-3.5 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-violet-500/30 dark:from-violet-500/10 dark:to-violet-600/10 dark:text-violet-300 lg:inline-block"
            >
              Daftar venue
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 lg:hidden"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b14]/95 lg:hidden">
            <nav className="grid gap-1.5">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-semibold text-gray-700 transition hover:border-cyan-100 hover:bg-cyan-50/80 hover:text-cyan-700 dark:text-gray-200 dark:hover:border-cyan-500/20 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-cyan-600 dark:bg-white/5 dark:text-cyan-400">
                    <Icon size={17} strokeWidth={2.25} />
                  </span>
                  {label}
                </a>
              ))}
            </nav>
            <div className="my-3 border-t border-gray-100 dark:border-white/10" />
            <div className="grid gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold dark:border-white/10"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-cyan-500/20"
              >
                Daftar
              </Link>
              <Link
                href="/register/owner"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
              >
                Daftar venue
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
