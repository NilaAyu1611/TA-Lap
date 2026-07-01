"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentType, type ReactNode } from "react";
import {
  Building2,
  Clock3,
  Eye,
  EyeOff,
  Home,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Percent,
  Phone,
  User,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import ThemeInit from "@/components/admin/ThemeInit";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { registerOwner } from "@/services/auth.service";

function HomeIconButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:border-violet-300/50 hover:bg-violet-500/20 ${className}`}
    >
      <Home size={20} className="transition group-hover:scale-110 group-hover:text-violet-200" />
    </Link>
  );
}

function HomeIconButtonLight({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      title="Beranda"
      className={`group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 dark:border-white/15 dark:bg-white/10 dark:text-violet-400 ${className}`}
    >
      <Home size={20} className="transition group-hover:scale-110" />
    </Link>
  );
}

const FEATURE_CARDS = [
  {
    icon: Building2,
    title: "Kelola lapangan",
    desc: "Tambah venue dan pantau pesanan dari dashboard.",
  },
  {
    icon: Clock3,
    title: "Pesanan real-time",
    desc: "Booking masuk tercatat otomatis.",
  },
  {
    icon: Percent,
    title: "Daftar gratis",
    desc: "Komisi platform hanya per transaksi berhasil.",
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1577219491134-ce5827307922?q=80&w=1600&auto=format&fit=crop";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-violet-500/60 dark:focus:ring-violet-500/15";

export default function RegisterOwnerPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    nama_usaha: "",
    catatan: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Nomor telepon tidak valid");
      return;
    }

    if (!form.city.trim()) {
      setError("Kota wajib diisi");
      return;
    }

    if (!agreed) {
      setError("Setujui persyaratan pendaftaran terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      await registerOwner({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: phoneDigits,
        city: form.city.trim(),
        nama_usaha: form.nama_usaha || undefined,
        catatan: form.catatan || undefined,
      });
      router.push("/login?registered=owner");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Gagal mendaftar"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50/40 text-gray-900 transition-colors dark:from-[#060b14] dark:via-[#060b14] dark:to-[#0a0a14] dark:text-white">
      <ThemeInit />

      <div className="pointer-events-none absolute inset-0 overflow-hidden dark:opacity-60">
        <div className="absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-violet-300/30 blur-[90px] dark:bg-violet-500/15" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-300/25 blur-[90px] dark:bg-indigo-600/15" />
      </div>

      <header className="relative z-30 flex items-center justify-between border-b border-violet-100/80 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#060b14]/80">
        <HomeIconButtonLight />
        <ThemeToggle />
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-57px)] flex-col lg:min-h-screen lg:flex-row">
        {/* LEFT */}
        <section className="relative hidden overflow-hidden lg:flex lg:w-[48%] lg:flex-col">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0618]/92 via-violet-950/85 to-indigo-950/80" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <HomeIconButton />

            <div>
              <h1 className="max-w-lg font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
                Kelola venue lapangan
              </h1>
              <p className="mt-4 max-w-md text-base text-gray-300">
                Daftar, verifikasi admin, mulai terima pesanan.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="rounded-lg bg-white/10 p-2 text-violet-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-sm text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile hero */}
        <section className="relative h-36 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-[#0a0618]/85" />
          <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-5">
            <h1 className="font-display text-2xl font-bold text-white">Daftar venue</h1>
          </div>
        </section>

        {/* RIGHT — form */}
        <section className="relative flex flex-1 flex-col justify-center overflow-hidden px-4 py-8 sm:px-8 lg:w-[52%] lg:px-10 lg:py-10 xl:px-14">
          <div className="pointer-events-none absolute -right-20 top-20 hidden h-64 w-64 rounded-full bg-violet-200/30 blur-3xl lg:block dark:bg-violet-500/10" />

          <div className="absolute right-6 top-6 z-20 hidden lg:block xl:right-10 xl:top-10">
            <ThemeToggle />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-lg">
            <div className="mb-6 lg:mb-8">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Daftar venue
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Akun diverifikasi admin sebelum venue aktif.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white/95 p-5 shadow-lg shadow-violet-100/40 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-7">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Nama lengkap" icon={User} required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Nama penanggung jawab"
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Nama usaha" icon={Building2}>
                  <input
                    type="text"
                    value={form.nama_usaha}
                    onChange={(e) => update("nama_usaha", e.target.value)}
                    placeholder="Arena Sport Bandung"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Email" icon={Mail} required>
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="email@bisnis.com"
                    required
                    className={inputClass}
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Nomor telepon" icon={Phone} required>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      required
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Kota" icon={MapPin} required>
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Bandung"
                      required
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <FormField label="Password" icon={LockKeyhole} required>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      className={`${inputClass} pr-12`}
                    />
                    <TogglePassword
                      visible={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                  </div>
                </FormField>

                <FormField label="Konfirmasi password" icon={LockKeyhole} required>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Ulangi password"
                      required
                      className={`${inputClass} pr-12`}
                    />
                    <TogglePassword
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                    />
                  </div>
                </FormField>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={form.catatan}
                    onChange={(e) => update("catatan", e.target.value)}
                    placeholder="Info tambahan untuk admin"
                    rows={2}
                    className={`${inputClass} resize-none pl-4`}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-violet-200/80 bg-violet-50/50 p-3.5 dark:border-violet-500/20 dark:bg-violet-500/5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600"
                  />
                  <span className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    Data yang saya isi benar. Akun akan diverifikasi admin sebelum
                    venue dapat aktif.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                <Link href="/register" className="font-semibold text-cyan-600 dark:text-cyan-400">
                  Daftar akun booking
                </Link>
              </p>
              <p>
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold text-violet-600 dark:text-violet-400">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FormField({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative [&_input]:pl-11">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"
        />
        {children}
      </div>
    </div>
  );
}

function TogglePassword({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}
