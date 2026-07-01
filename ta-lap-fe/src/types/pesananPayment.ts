export type PesananPaymentInfo = {
  status: string;
  jam_mulai?: string;
  pembayaran?: {    status: string;
    metode?: string;
    gateway_awaiting?: boolean;
    kode_transaksi?: string;
    id?: string;
  } | null;
};
