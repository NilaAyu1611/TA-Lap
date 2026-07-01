"use client";

import {
  Building2,
  CalendarDays,
  AtSign,
  Globe,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, formatRupiah } from "@/lib/auth";
import {
  OWNER_BUSINESS_TYPES,
  OWNER_BUSINESS_TYPE_LABELS,
  LEGACY_BUSINESS_TYPE_LABELS,
  OwnerProfile,
  OwnerProfileFormData,
} from "@/types/ownerProfile";
import VenueHierarchyGuide, {
  FieldHint,
} from "@/components/shared/VenueHierarchyGuide";
import { INDONESIAN_BANKS } from "@/lib/indonesianBanks";

type Props = {
  profile: OwnerProfile;
  saving?: boolean;
  onSave: (data: OwnerProfileFormData) => Promise<string>;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-black/20 dark:text-white";

const selectClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 dark:border-white/10 dark:bg-black/20 dark:text-white";

const verificationLabels: Record<string, { label: string; className: string }> =
  {
    approved: {
      label: "Terverifikasi",
      className:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    pending: {
      label: "Menunggu Verifikasi",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  };

function profileToForm(profile: OwnerProfile): OwnerProfileFormData {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone || "",
    city: profile.city || "",
    avatar: profile.avatar || "",
    business_name: profile.business_name || "",
    business_type: profile.business_type || "",
    business_description: profile.business_description || "",
    address: profile.address || "",
    province: profile.province || "",
    postal_code: profile.postal_code || "",
    website: profile.website || "",
    instagram: profile.instagram || "",
    npwp: profile.npwp || "",
    bank_code: profile.bank_code || "",
    bank_account_number: profile.bank_account_number || "",
    bank_account_holder: profile.bank_account_holder || "",
  };
}

export default function OwnerProfileForm({ profile, saving, onSave }: Props) {
  const [form, setForm] = useState<OwnerProfileFormData>(() =>
    profileToForm(profile)
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(profileToForm(profile));
  }, [profile]);

  const update = (field: keyof OwnerProfileFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      const message = await onSave(form);
      setSuccess(message || "Profil berhasil diperbarui");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil");
    } finally {
      setSubmitting(false);
    }
  };

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const verification = profile.verificationStatus
    ? verificationLabels[profile.verificationStatus]
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="flex shrink-0 items-start gap-4">
            {form.avatar || profile.avatar ? (
              <img
                src={form.avatar || profile.avatar || ""}
                alt={profile.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-violet-500/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl font-bold text-violet-600 dark:text-violet-400">
                {initials}
              </div>
            )}
            <div className="min-w-0 lg:hidden">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email}
              </p>
            </div>
            {profile.business_name && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-violet-700 dark:text-violet-400">
                <Store size={14} />
                {profile.business_name}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-white/10 dark:text-gray-300">
                {profile.status}
              </span>
              {verification && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${verification.className}`}
                >
                  <ShieldCheck size={12} />
                  {verification.label}
                </span>
              )}
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                Mitra sejak {formatDate(profile.joined)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <StatMini label="Lapangan" value={String(profile.totalLapangan)} />
            <StatMini label="Aktif" value={String(profile.lapanganAktif)} />
            <StatMini label="Booking" value={String(profile.totalBooking)} />
            <StatMini
              label="Pendapatan"
              value={formatRupiah(profile.volumeTransaksi)}
              small
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            {success}
          </div>
        )}

        <Section
          title="Data Penanggung Jawab"
          description="Informasi kontak pemilik akun owner / PIC venue."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama Lengkap" icon={User} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Email" icon={Mail} required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Nomor Telepon / WhatsApp" icon={Phone} required>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
                className={inputClass}
              />
            </Field>
            <Field label="Kota Domisili" icon={MapPin}>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Bandung"
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="URL Foto Profil (opsional)" icon={User}>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => update("avatar", e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section
          title="Informasi Bisnis / Venue"
          description="Brand usaha Anda — berbeda dari nama tiap lapangan di menu Kelola Lapangan."
        >
          <VenueHierarchyGuide variant="compact" className="mb-4" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama Brand / Usaha" icon={Store} required>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => update("business_name", e.target.value)}
                placeholder="Contoh: Arena Sport Bandung"
                required
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2 -mt-2">
              <FieldHint>
                Muncul sebagai operator venue di halaman booking pemain (bukan
                judul lapangan).
              </FieldHint>
            </div>
            <Field label="Jenis Bisnis Lapangan" icon={Building2} required>
              <select
                value={form.business_type}
                onChange={(e) => update("business_type", e.target.value)}
                required
                className={selectClass}
              >
                <option value="">Pilih jenis bisnis lapangan...</option>
                {OWNER_BUSINESS_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            {profile.business_type &&
              profile.business_type in LEGACY_BUSINESS_TYPE_LABELS && (
                <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                  Data jenis usaha lama terdeteksi. Silakan pilih ulang jenis
                  bisnis lapangan yang sesuai di dropdown di atas.
                </div>
              )}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi Bisnis
              </label>
              <textarea
                value={form.business_description}
                onChange={(e) =>
                  update("business_description", e.target.value)
                }
                rows={4}
                placeholder="Ceritakan jenis venue, layanan, dan keunggulan bisnis Anda..."
                className={`${inputClass} resize-y`}
              />
            </div>
            <Field label="NPWP (opsional)" icon={Building2}>
              <input
                type="text"
                value={form.npwp}
                onChange={(e) => update("npwp", e.target.value)}
                placeholder="12.345.678.9-012.000"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Rekening Pencairan"
          description="Wajib diisi agar pendapatan booking online dapat ditransfer ke rekening Anda."
        >
          {!profile.bank_complete && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Lengkapi rekening bank untuk menerima transfer pendapatan dari
              pembayaran online (QRIS, transfer, e-wallet).
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bank" icon={Landmark} required>
              <select
                value={form.bank_code}
                onChange={(e) => update("bank_code", e.target.value)}
                required
                className={selectClass}
              >
                <option value="">Pilih bank...</option>
                {INDONESIAN_BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nomor Rekening" icon={Landmark} required>
              <input
                type="text"
                inputMode="numeric"
                value={form.bank_account_number}
                onChange={(e) =>
                  update(
                    "bank_account_number",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="1234567890"
                required
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Nama Pemilik Rekening" icon={User} required>
                <input
                  type="text"
                  value={form.bank_account_holder}
                  onChange={(e) =>
                    update("bank_account_holder", e.target.value)
                  }
                  placeholder="Sesuai buku tabungan"
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
          <div className="mt-3">
            <FieldHint>
              Diperlukan agar admin platform bisa transfer pendapatan booking Anda.
              Pastikan nama pemilik rekening sesuai data bank.
            </FieldHint>
          </div>
        </Section>

        <Section
          title="Lokasi & Alamat Usaha"
          description="Alamat kantor/venue utama — berbeda dari alamat per lapangan."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Alamat Lengkap" icon={MapPin}>
                <textarea
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  rows={2}
                  placeholder="Jl. ..., RT/RW, Kelurahan..."
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
            <Field label="Provinsi" icon={MapPin}>
              <input
                type="text"
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                placeholder="Jawa Barat"
                className={inputClass}
              />
            </Field>
            <Field label="Kode Pos" icon={MapPin}>
              <input
                type="text"
                value={form.postal_code}
                onChange={(e) => update("postal_code", e.target.value)}
                placeholder="40111"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Kontak & Media Sosial"
          description="Opsional — membantu pemain mengenal venue Anda."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Website" icon={Globe}>
              <input
                type="url"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://venueanda.com"
                className={inputClass}
              />
            </Field>
            <Field label="Instagram" icon={AtSign}>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="@username"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-white/10">
          <button
            type="submit"
            disabled={submitting || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
          >
            {(submitting || saving) && (
              <Loader2 size={16} className="animate-spin" />
            )}
            <Save size={16} />
            Simpan Profil
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-semibold">Informasi Akun</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="ID Owner" value={`#${String(profile.id).padStart(4, "0")}`} />
          <Row
            label="Jenis bisnis lapangan"
            value={
              profile.business_type
                ? OWNER_BUSINESS_TYPE_LABELS[profile.business_type] ||
                  profile.business_type
                : "—"
            }
          />
          <Row
            label="Verifikasi admin"
            value={verification?.label || "—"}
          />
          <Row
            label="Terakhir login"
            value={
              profile.lastLogin
                ? formatDate(profile.lastLogin.created_at)
                : "—"
            }
            icon={CalendarDays}
          />
          <Row
            label="Profil bisnis diperbarui"
            value={
              profile.profile_updated_at
                ? formatDate(profile.profile_updated_at)
                : "Belum pernah"
            }
          />
        </dl>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 pt-6 first:border-0 first:pt-0 dark:border-white/10">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"
        />
        <div className="[&_input]:pl-10 [&_select]:pl-10 [&_textarea]:pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function StatMini({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl bg-violet-50 px-3 py-2.5 dark:bg-violet-500/10">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`font-bold text-violet-700 dark:text-violet-400 ${
          small ? "text-xs" : "text-lg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="flex items-center gap-1.5 text-gray-500">
        {Icon && <Icon size={14} />}
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
