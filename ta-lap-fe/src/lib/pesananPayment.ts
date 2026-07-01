import { PesananPaymentInfo } from "@/types/pesananPayment";

/** Pembayaran sudah lunas (online otomatis atau tunai dikonfirmasi owner). */
export function isPaymentSuccess(pesanan: PesananPaymentInfo): boolean {
  return (
    pesanan.pembayaran?.status === "sukses" ||
    pesanan.status === "dibayar" ||
    pesanan.status === "selesai"
  );
}

/** Pembayaran tunai atau online yang sudah dikirim ke gateway dan menunggu konfirmasi. */
export function isAwaitingPaymentConfirmation(
  pesanan: PesananPaymentInfo
): boolean {
  if (isPaymentSuccess(pesanan)) return false;
  if (pesanan.status !== "pending" || pesanan.pembayaran?.status !== "menunggu") {
    return false;
  }
  if (pesanan.pembayaran.metode === "cash") return true;
  return Boolean(pesanan.pembayaran.gateway_awaiting);
}

/** Pesanan masih perlu dibayar atau bisa coba metode lain. */
export function needsPayment(pesanan: PesananPaymentInfo): boolean {
  if (pesanan.status !== "pending") return false;
  if (isPaymentSuccess(pesanan)) return false;
  if (!pesanan.pembayaran || pesanan.pembayaran.status === "gagal") return true;
  if (
    pesanan.pembayaran.status === "menunggu" &&
    !isAwaitingPaymentConfirmation(pesanan)
  ) {
    return true;
  }
  return false;
}

export function getPaymentPageHref(pesananId: string): string {
  return `/user/pembayaran?pesanan=${pesananId}`;
}

export function getTransaksiReceiptHref(transaksiId: string): string {
  return `/user/transaksi?struk=${transaksiId}`;
}

export function countNeedsPayment(pesanans: PesananPaymentInfo[]): number {
  return pesanans.filter(needsPayment).length;
}
