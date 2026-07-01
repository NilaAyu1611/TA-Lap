"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  Clock3,
  CreditCard,
  Landmark,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import UserNavbar from "@/components/UserNavbar";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { PaymentChannel, loadMidtransSnap, openMidtransSnap, useMidtransSnap } from "@/lib/midtrans";
import { formatDate, formatRupiah, formatTime, getAuthToken } from "@/lib/auth";
import { getMyPesanan } from "@/services/pesanan.service";
import {
  createCashPayment,
  createSnapPayment,
  abortSnapPayment,
  markGatewayAwaiting,
  getPaymentConfig,
  syncPaymentStatus,
  type PaymentConfig,
} from "@/services/pembayaran.service";
import { needsPayment } from "@/lib/pesananPayment";

type PendingPesanan = {
  id: string;
  total_harga: number | string;
  tanggal_booking: string;
  jam_mulai: string;
  jam_selesai: string;
  lapangan?: { nama: string; jenis?: { nama: string } };
  pembayaran?: { status: string; metode?: string } | null;
};

type MethodId = PaymentChannel | "cash";

const METHODS: {
  id: MethodId;
  label: string;
  desc: string;
  icon: typeof QrCode;
  online: boolean;
}[] = [
  {
    id: "qris",
    label: "QRIS",
    desc: "Scan QR via GoPay, OVO, DANA, dll.",
    icon: QrCode,
    online: true,
  },
  {
    id: "transfer",
    label: "Transfer Bank",
    desc: "Virtual Account BCA, BNI, BRI, Permata",
    icon: Landmark,
    online: true,
  },
  {
    id: "ewallet",
    label: "E-Wallet",
    desc: "GoPay, ShopeePay, DANA, LinkAja",
    icon: Smartphone,
    online: true,
  },
  {
    id: "cash",
    label: "Tunai di Venue",
    desc: "Bayar langsung saat datang ke lapangan",
    icon: Banknote,
    online: false,
  },
];

export default function PembayaranPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
          <UserNavbar active="pembayaran" />
          <p className="p-10 text-center text-gray-500">Memuat pembayaran...</p>
        </main>
      }
    >
      <PembayaranContent />
    </Suspense>
  );
}

function PembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusPesananId = searchParams.get("pesanan");
  const focusRef = useRef<HTMLDivElement>(null);
  const [selectedMethods, setSelectedMethods] = useState<
    Record<string, MethodId>
  >({});
  const [pending, setPending] = useState<PendingPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState("");
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [clientKey, setClientKey] = useState<string | null>(null);
  const [isSandbox, setIsSandbox] = useState(true);
  const [configIssue, setConfigIssue] = useState<
    PaymentConfig["configIssue"] | "unreachable"
  >(null);
  const { ready } = useMidtransSnap(clientKey, isSandbox);

  const loadPending = async () => {
    const result = await getMyPesanan();
    const items = (result.data || []).filter(
      (p: PendingPesanan & { status: string }) => needsPayment(p)
    );
    setPending(items);
  };

  const sortedPending = useMemo(() => {
    if (!focusPesananId) return pending;
    const focused = pending.find((p) => p.id === focusPesananId);
    if (!focused) return pending;
    return [focused, ...pending.filter((p) => p.id !== focusPesananId)];
  }, [pending, focusPesananId]);

  useEffect(() => {
    const init = async () => {
      try {
        const [config] = await Promise.all([
          getPaymentConfig(),
          loadPending(),
        ]);
        setSnapEnabled(config.data.snapEnabled);
        setClientKey(config.data.clientKey);
        setIsSandbox(config.data.isSandbox);
        setConfigIssue(config.data.configIssue ?? null);
      } catch (error) {
        console.error(error);
        setConfigIssue("unreachable");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading && focusPesananId && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, focusPesananId, sortedPending.length]);

  const getSelectedMethod = (pesananId: string): MethodId =>
    selectedMethods[pesananId] ?? "qris";

  const setSelectedMethodFor = (pesananId: string, method: MethodId) => {
    setSelectedMethods((prev) => ({ ...prev, [pesananId]: method }));
  };

  const handlePay = async (item: PendingPesanan) => {
    const selectedMethod = getSelectedMethod(item.id);
    const method = METHODS.find((m) => m.id === selectedMethod)!;

    setPayError("");
    setPaySuccess("");

    if (!getAuthToken()) {
      setPayError("Anda belum login. Silakan login ulang.");
      return;
    }

    try {
      setPayingId(item.id);

      if (!method.online) {
        const result = await createCashPayment({ pesanan_id: item.id });
        await loadPending();
        setPaySuccess(
          result.message ||
            "Pembayaran tunai dicatat. Bayar di venue; owner akan konfirmasi."
        );
        setTimeout(() => router.push("/user/pesanan"), 1500);
        return;
      }

      if (!snapEnabled || !clientKey) {
        setPayError(
          "Payment gateway belum aktif. Pilih Bayar Tunai di Venue atau hubungi admin untuk setup Midtrans."
        );
        return;
      }

      const result = await createSnapPayment({
        pesanan_id: item.id,
        channel: selectedMethod as PaymentChannel,
      });

      const token = result.data?.snap_token;
      const payClientKey = result.data?.client_key || clientKey;
      const paySandbox = result.data?.is_sandbox ?? isSandbox;

      if (!token) {
        throw new Error("Token pembayaran tidak tersedia dari server");
      }
      if (!payClientKey) {
        throw new Error("Client key Midtrans tidak tersedia");
      }

      // Script Snap harus match environment yang dipakai backend saat buat token
      await loadMidtransSnap(payClientKey, paySandbox);

      let paymentSubmitted = false;

      openMidtransSnap(token, {
        onSuccess: async () => {
          paymentSubmitted = true;
          setPayingId(null);
          try {
            await syncPaymentStatus(item.id);
            setPaySuccess("Pembayaran berhasil! Status booking diperbarui.");
          } catch {
            setPaySuccess(
              "Pembayaran berhasil di Midtrans. Status akan terupdate sebentar lagi."
            );
          }
          await loadPending();
          setTimeout(() => router.push("/user/pesanan"), 1500);
        },
        onPending: async () => {
          paymentSubmitted = true;
          setPayingId(null);
          try {
            await markGatewayAwaiting(item.id);
          } catch {
            /* status may sync via webhook */
          }
          setPaySuccess(
            "Pembayaran menunggu konfirmasi. Cek status di menu Pesanan."
          );
          await loadPending();
          setTimeout(() => router.push("/user/pesanan"), 2000);
        },
        onError: async () => {
          setPayingId(null);
          if (!paymentSubmitted) {
            try {
              await abortSnapPayment(item.id);
            } catch {
              /* ignore */
            }
          }
          setPayError(
            "Pembayaran gagal atau dibatalkan. Silakan pilih metode lain."
          );
          await loadPending();
        },
        onClose: async () => {
          setPayingId(null);
          if (!paymentSubmitted) {
            try {
              await abortSnapPayment(item.id);
            } catch {
              /* ignore */
            }
            await loadPending();
          }
        },
      });
    } catch (error) {
      console.error(error);
      setPayError(getApiErrorMessage(error, "Gagal memproses pembayaran"));
      setPayingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1120] dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <UserNavbar active="pembayaran" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Pembayaran Booking</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            Bayar booking dengan transaksi nyata via Midtrans — QRIS, Virtual
            Account, dan E-Wallet. Aman & terverifikasi otomatis.
          </p>
        </div>

        {snapEnabled && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={18} />
            <div className="text-sm">
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">
                Payment Gateway Aktif {isSandbox ? "(Sandbox)" : "(Production)"}
              </p>
              <p className="mt-0.5 text-emerald-700/80 dark:text-emerald-300/80">
                Pembayaran diproses Midtrans. Status booking otomatis terupdate
                setelah transaksi sukses.
              </p>
            </div>
          </div>
        )}

        {!snapEnabled && !loading && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {configIssue === "unreachable" ? (
              <>
                Tidak dapat menghubungi backend pembayaran. Pastikan server{" "}
                <code className="text-xs">ta-lap-be</code> berjalan (port 3002),
                lalu refresh halaman.
              </>
            ) : configIssue === "placeholder" ? (
              <>
                Kunci Midtrans di <code className="text-xs">ta-lap-be/.env</code>{" "}
                masih placeholder. Ganti{" "}
                <code className="text-xs">MIDTRANS_SERVER_KEY</code> dan{" "}
                <code className="text-xs">MIDTRANS_CLIENT_KEY</code> dengan kunci
                sandbox asli dari{" "}
                <a
                  href="https://dashboard.sandbox.midtrans.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline"
                >
                  dashboard Midtrans Sandbox
                </a>
                , lalu restart backend.
              </>
            ) : configIssue === "invalid_credentials" ? (
              <>
                Kunci Midtrans ditolak API. Pastikan kunci dari{" "}
                <strong>dashboard.sandbox.midtrans.com</strong> dan{" "}
                <code className="text-xs">MIDTRANS_IS_PRODUCTION=false</code>{" "}
                di <code className="text-xs">ta-lap-be/.env</code>, lalu restart
                backend.
              </>
            ) : configIssue === "production_keys_sandbox_mode" ? (
              <>
                Kunci sandbox terdeteksi tapi{" "}
                <code className="text-xs">MIDTRANS_IS_PRODUCTION=true</code>.
                Set ke <code className="text-xs">false</code> untuk dashboard
                sandbox.
              </>
            ) : configIssue === "key_pair_mismatch" ? (
              <>
                Server Key dan Client Key tidak cocok (sandbox vs production
                campur). Salin ulang pasangan kunci dari dashboard yang sama.
              </>
            ) : configIssue === "invalid_format" ? (
              <>
                Format kunci Midtrans tidak valid. Server key harus diawali{" "}
                <code className="text-xs">SB-Mid-server-</code> dan client key{" "}
                <code className="text-xs">SB-Mid-client-</code> (sandbox).
              </>
            ) : (
              <>
                Gateway online belum dikonfigurasi. Tambahkan kunci Midtrans di{" "}
                <code className="text-xs">ta-lap-be/.env</code> atau gunakan{" "}
                <strong>Bayar Tunai di Venue</strong>.
              </>
            )}
          </div>
        )}

        {payError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10">
            {payError}
          </div>
        )}

        {paySuccess && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            {paySuccess}
          </div>
        )}

        <div className="mt-10 space-y-7">
          {loading && (
            <p className="text-center text-gray-500">Memuat data pembayaran...</p>
          )}

          {sortedPending.map((item) => {
            const isFocused = focusPesananId === item.id;
            const selectedMethod = getSelectedMethod(item.id);
            return (
            <div
              key={item.id}
              id={`pesanan-${item.id}`}
              ref={isFocused ? focusRef : undefined}
              className={`rounded-3xl border bg-white/80 p-7 shadow-lg backdrop-blur-xl dark:bg-white/5 ${
                isFocused
                  ? "border-cyan-500 ring-2 ring-cyan-500/30 dark:border-cyan-400"
                  : "border-gray-200 dark:border-white/10"
              }`}
            >
              {isFocused && (
                <p className="mb-4 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  Pesanan yang Anda pilih — selesaikan pembayaran di bawah
                </p>
              )}
              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold">
                      {item.lapangan?.nama || "Lapangan"}
                    </h2>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                      {item.lapangan?.jenis?.nama || "-"}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoBox
                      icon={CalendarDays}
                      label="Tanggal"
                      value={formatDate(item.tanggal_booking)}
                    />
                    <InfoBox
                      icon={Clock3}
                      label="Jam Booking"
                      value={`${formatTime(item.jam_mulai)} - ${formatTime(item.jam_selesai)}`}
                    />
                    <InfoBox
                      icon={Wallet}
                      label="Total Bayar"
                      value={formatRupiah(item.total_harga)}
                      highlight
                    />
                    <InfoBox
                      icon={CreditCard}
                      label="Status"
                      value="Belum Dibayar"
                      warning
                    />
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold">Metode Pembayaran</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {METHODS.map((method) => {
                        const Icon = method.icon;
                        const active = selectedMethod === method.id;
                        const disabled =
                          method.online && !snapEnabled && method.id !== "cash";

                        return (
                          <button
                            key={method.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedMethodFor(item.id, method.id)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              active
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"
                            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                          >
                            <Icon
                              size={24}
                              className={
                                active ? "text-cyan-600" : "text-gray-400"
                              }
                            />
                            <p className="mt-3 font-semibold">{method.label}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {method.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-black/20">
                    {selectedMethod === "cash" ? (
                      <p>
                        Anda memilih bayar tunai di venue. Setelah konfirmasi,
                        owner lapangan akan memverifikasi pembayaran saat Anda
                        datang.
                      </p>
                    ) : (
                      <p>
                        Klik <strong>Bayar Sekarang</strong> untuk membuka popup
                        Midtrans. Pilih{" "}
                        {METHODS.find((m) => m.id === selectedMethod)?.label}{" "}
                        dan selesaikan pembayaran. Transaksi nyata{" "}
                        {isSandbox ? "(mode sandbox/test)" : ""}.
                      </p>
                    )}
                  </div>
                </div>

                <div className="xl:w-[240px]">
                  <button
                    type="button"
                    onClick={() => handlePay(item)}
                    disabled={
                      payingId === item.id ||
                      (selectedMethod !== "cash" && (!snapEnabled || !ready))
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CreditCard size={18} />
                    {payingId === item.id ? "Memproses..." : "Bayar Sekarang"}
                  </button>
                  {selectedMethod !== "cash" && snapEnabled && !ready && (
                    <p className="mt-2 text-center text-xs text-gray-500">
                      Memuat payment gateway...
                    </p>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {!loading && pending.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white/70 py-20 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h3 className="text-2xl font-semibold">Tidak Ada Pembayaran</h3>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {focusPesananId
                ? "Pesanan ini sudah dibayar atau sedang menunggu konfirmasi."
                : "Semua booking Anda sudah dibayar atau belum ada pesanan pending."}
            </p>
            {focusPesananId && (
              <button
                type="button"
                onClick={() => router.push("/user/pesanan")}
                className="mt-4 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
              >
                Kembali ke Pesanan
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
  highlight,
  warning,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        warning
          ? "bg-yellow-100 dark:bg-yellow-500/10"
          : "bg-gray-100 dark:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-cyan-500" />
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      </div>
      <p
        className={`mt-2 font-medium ${
          highlight ? "font-semibold text-green-600 dark:text-green-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
