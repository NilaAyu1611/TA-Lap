"use client";

import { Percent, Wrench } from "lucide-react";
import {
  formInputClass,
  formLabelClass,
  formSelectClass,
} from "@/components/admin/lapangan/formStyles";
import SettingsToggle from "@/components/admin/settings/SettingsToggle";
import { INDONESIAN_BANKS } from "@/lib/indonesianBanks";
import { SettingsFormData } from "@/types/settings";

type Props = {
  form: SettingsFormData;
  onChange: (patch: Partial<SettingsFormData>) => void;
};

export default function SettingsBusinessSection({ form, onChange }: Props) {
  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
          <Percent size={20} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Bisnis & Komisi</h2>
          <p className="text-xs text-gray-500">
            Model pendapatan platform dan mode operasional
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={formLabelClass}>Komisi Platform (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={form.komisi_persen}
            onChange={(e) =>
              onChange({ komisi_persen: Number(e.target.value) })
            }
            className={formInputClass}
          />
          <p className="mt-1.5 text-[11px] text-gray-500">
            Dipotong per booking/transaksi sukses — bukan per lapangan. Lapangan
            sama di hari berbeda = komisi terpisah masing-masing 5%.
          </p>
        </div>

        <div>
          <label className={formLabelClass}>Potongan Pembatalan (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={form.batal_potongan_persen}
            onChange={(e) =>
              onChange({ batal_potongan_persen: Number(e.target.value) })
            }
            className={formInputClass}
          />
          <p className="mt-1.5 text-[11px] text-gray-500">
            Saat booking <strong>sudah dibayar</strong> lalu dibatalkan — sisa
            dikembalikan ke customer. Belum bayar = tanpa potongan (contoh: 25%
            potong = refund 75%).
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Rekening Setoran Komisi Tunai (Owner → Platform)
        </h4>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          Ditampilkan di halaman Setoran Bulanan owner sebagai tujuan transfer
          komisi 5% dari transaksi tunai.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={formLabelClass}>Bank Platform</label>
            <select
              value={form.platform_bank_code}
              onChange={(e) =>
                onChange({ platform_bank_code: e.target.value })
              }
              className={formSelectClass}
            >
              <option value="">Pilih bank</option>
              {INDONESIAN_BANKS.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={formLabelClass}>No. Rekening</label>
            <input
              value={form.platform_bank_account_number}
              onChange={(e) =>
                onChange({ platform_bank_account_number: e.target.value })
              }
              className={formInputClass}
              placeholder="1234567890"
            />
          </div>
          <div>
            <label className={formLabelClass}>Atas Nama</label>
            <input
              value={form.platform_bank_account_holder}
              onChange={(e) =>
                onChange({ platform_bank_account_holder: e.target.value })
              }
              className={formInputClass}
              placeholder="PT TA-LAP / Admin"
            />
          </div>
          <div>
            <label className={formLabelClass}>Catatan E-Wallet (opsional)</label>
            <input
              value={form.platform_ewallet_note}
              onChange={(e) =>
                onChange({ platform_ewallet_note: e.target.value })
              }
              className={formInputClass}
              placeholder="GoPay/OVO/DANA ke no. ..."
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-violet-200/80 bg-violet-50/50 p-4 dark:border-violet-500/20 dark:bg-violet-500/5">
        <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          Pencairan ke Owner (Manual)
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          Pembayaran online masuk ke rekening merchant Midtrans milik platform
          (admin). Setelah user bayar sukses, admin transfer manual bagian owner
          ke rekening mereka, lalu tandai <strong>Sudah ditransfer</strong> di
          menu Transaksi.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="flex items-start gap-3">
          <Wrench size={18} className="mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <h4 className="text-sm font-semibold">Mode Maintenance</h4>
            <p className="mt-0.5 text-xs text-gray-500">
              Nonaktifkan akses booking sementara saat update sistem
            </p>
          </div>
        </div>
        <SettingsToggle
          enabled={form.maintenance_mode}
          onChange={(maintenance_mode) => onChange({ maintenance_mode })}
        />
      </div>
    </section>
  );
}
