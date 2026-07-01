import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import LandingCompanyProfile from "@/components/landing/LandingCompanyProfile";
import LandingFooter from "@/components/landing/LandingFooter";
import ThemeInit from "@/components/admin/ThemeInit";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Tentang Kami — TA-LAP",
  description:
    "Profil perusahaan TA-LAP — platform booking lapangan olahraga untuk pemain dan pemilik venue.",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#060b14]">
      <ThemeInit />
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b14]/90">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo href="/" subtitle="Booking lapangan olahraga" accent="cyan" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:border-cyan-300 dark:border-white/10"
            >
              <ArrowLeft size={16} />
              Beranda
            </Link>
          </div>
        </div>
      </header>

      <LandingCompanyProfile />
      <LandingFooter />
    </main>
  );
}
