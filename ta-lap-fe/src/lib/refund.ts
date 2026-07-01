export interface KebijakanBatal {
  potongan_persen: number;
  refund_persen: number;
  deskripsi: string;
}

export interface RefundBreakdown {
  potongan_persen: number;
  refund_persen: number;
  jumlah_potongan: number;
  jumlah_refund: number;
}

export function hitungRefundPreview(
  totalBayar: number,
  potonganPersen = 25
): RefundBreakdown {
  const total = Math.round(Number(totalBayar));
  const rate = Math.min(100, Math.max(0, Number(potonganPersen)));
  const jumlahPotongan = Math.round(total * (rate / 100));
  const jumlahRefund = Math.max(0, total - jumlahPotongan);

  return {
    potongan_persen: rate,
    refund_persen: 100 - rate,
    jumlah_potongan: jumlahPotongan,
    jumlah_refund: jumlahRefund,
  };
}

/** Potongan batal hanya berlaku jika pembayaran sudah sukses. */
export function isPaidForCancellation(pesanan: {
  status: string;
  pembayaran?: { status: string } | null;
}): boolean {
  return (
    pesanan.pembayaran?.status === "sukses" || pesanan.status === "dibayar"
  );
}
