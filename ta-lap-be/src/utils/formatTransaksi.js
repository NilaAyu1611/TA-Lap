import { formatDisplayEmail } from "../services/walkInCustomerService.js";

export const transaksiInclude = {
  pesanan: {
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      lapangan: {
        include: {
          jenis: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  },
};

export const formatTransaksi = (item) => ({
  id: String(item.id),
  kode_transaksi: `TRX-${String(item.id).padStart(6, "0")}`,
  kode_booking: item.pesanan?.kode_booking ?? null,
  tanggal_booking: item.pesanan?.tanggal_booking ?? null,
  jam_mulai: item.pesanan?.jam_mulai ?? null,
  jam_selesai: item.pesanan?.jam_selesai ?? null,
  metode: item.metode,
  status: item.status,
  status_komisi: item.status_komisi,
  status_payout_owner: item.status_payout_owner,
  total_bayar: Number(item.total_bayar),
  komisi_persen: Number(item.komisi_persen),
  komisi_platform: Number(item.komisi_platform),
  pendapatan_owner: Number(item.pendapatan_owner),
  jumlah_refund: item.jumlah_refund ?? 0,
  jumlah_potongan: item.jumlah_potongan ?? 0,
  refund_reason: item.refund_reason,
  tanggal_bayar: item.tanggal_bayar,
  catatan_settlement: item.catatan_settlement,
  created_at: item.created_at,
  pesanan_id: String(item.pesanan_id),
  pesanan_status: item.pesanan?.status ?? null,
  user_id: item.pesanan?.user?.id != null ? String(item.pesanan.user.id) : null,
  user_name: item.pesanan?.user?.name ?? null,
  user_email: formatDisplayEmail(item.pesanan?.user?.email),
  lapangan_id:
    item.pesanan?.lapangan?.id != null
      ? String(item.pesanan.lapangan.id)
      : null,
  lapangan_nama: item.pesanan?.lapangan?.nama ?? null,
  lapangan_jenis: item.pesanan?.lapangan?.jenis?.nama ?? null,
  owner_id:
    item.pesanan?.lapangan?.owner?.id != null
      ? String(item.pesanan.lapangan.owner.id)
      : null,
  owner_name: item.pesanan?.lapangan?.owner?.name ?? null,
  owner_email: item.pesanan?.lapangan?.owner?.email ?? null,
});
