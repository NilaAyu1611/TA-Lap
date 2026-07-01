"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPublicSettings } from "@/services/settings.service";
import { ArrowUpRight, Clock3, Mail } from "lucide-react";

const FOOTER_NAV = [
  { href: "#lapangan", label: "Venue" },
  { href: "#fitur", label: "Fitur" },
  { href: "#pemain", label: "Cara Pesan" },
  { href: "#owner", label: "Mitra Venue" },
  { href: "/tentang", label: "Tentang Kami" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
  { href: "/register/owner", label: "Daftar venue" },
];

const DEFAULT_PHONE = "081234567890";
const DEFAULT_EMAIL = "support@talap.com";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ContactRow({
  href,
  external,
  icon,
  label,
  hoverClass,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  hoverClass: string;
}) {
  const className = `group inline-flex items-center gap-3 text-sm text-gray-600 transition dark:text-gray-300 ${hoverClass}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {icon}
        <span className="group-hover:underline">{label}</span>
      </a>
    );
  }

  return (
    <a href={href} className={className}>
      {icon}
      <span className="group-hover:underline">{label}</span>
    </a>
  );
}

export default function LandingFooter() {
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublicSettings();
        if (cancelled) return;
        if (data.app_phone) setPhone(data.app_phone);
        if (data.app_email) setEmail(data.app_email);
      } catch {
        // fallback defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const waUrl = buildWhatsAppUrl(phone);

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-white/10 dark:bg-[#060b14]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Kotak bantuan — satu-satunya aksi WhatsApp */}
        <div className="mb-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Butuh bantuan?
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Hubungi tim admin TA-LAP
            </h3>
            <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-400">
              Ada kendala booking, pendaftaran venue, atau pertanyaan lain?
              Chat langsung via WhatsApp — kami bantu secepatnya.
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-[#20bd5a] hover:shadow-lg"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat WhatsApp
            <ArrowUpRight size={15} className="opacity-80" />
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <BrandLogo href="/" subtitle="Booking lapangan olahraga" accent="cyan" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Platform booking lapangan olahraga untuk pemain dan pemilik venue.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Navigasi
            </p>
            <ul className="mt-3 space-y-2.5">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 transition hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Akun
            </p>
            <ul className="mt-3 space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Hubungi kami
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <ContactRow
                  href={waUrl}
                  external
                  hoverClass="hover:text-[#25D366]"
                  label={phone}
                  icon={
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 ring-1 ring-[#25D366]/20 transition group-hover:bg-[#25D366]/15">
                      <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    </span>
                  }
                />
              </li>
              <li>
                <ContactRow
                  href={`mailto:${email}`}
                  hoverClass="hover:text-cyan-600 dark:hover:text-cyan-400"
                  label={email}
                  icon={
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/15 transition group-hover:bg-cyan-500/15">
                      <Mail size={16} className="text-cyan-600 dark:text-cyan-400" />
                    </span>
                  }
                />
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
                  <Clock3 size={16} className="text-gray-500 dark:text-gray-400" />
                </span>
                Senin–Minggu · respons via WhatsApp
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-6 dark:border-white/10 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TA-LAP. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Akun pemain diperlukan untuk melakukan booking.
          </p>
        </div>
      </div>
    </footer>
  );
}
