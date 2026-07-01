import { useCallback, useEffect, useState } from "react";
import {
  getAllTransaksi,
  markKomisiLunas,
  markPayoutDicairkan,
  updateTransaksi,
} from "@/services/transaksi.service";
import {
  Transaksi,
  TransaksiStats,
  TransaksiUpdateData,
} from "@/types/transaksi";

export function useTransaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<TransaksiStats>({
    total: 0,
    sukses: 0,
    menunggu: 0,
    gagal: 0,
    komisiBelumLunas: 0,
    payoutMenunggu: 0,
    totalVolume: 0,
    totalKomisi: 0,
    pendapatanAdmin: 0,
    piutangKomisi: 0,
  });

  const loadTransaksi = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllTransaksi();
      setTransaksi(result.data);
      if (result.stats) {
        setStats(result.stats);
      } else {
        const rows = result.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hariIni = rows.filter((item) => {
          const created = new Date(item.created_at);
          return created >= today;
        }).length;

        setStats({
          total: rows.length,
          sukses: rows.filter((item) => item.status === "sukses").length,
          menunggu: rows.filter((item) => item.status === "menunggu").length,
          gagal: rows.filter(
            (item) => item.status === "gagal" || item.status === "refund"
          ).length,
          komisiBelumLunas: rows.filter(
            (item) => item.status_komisi === "belum_lunas" && item.status === "sukses"
          ).length,
          payoutMenunggu: rows.filter(
            (item) =>
              item.status_payout_owner === "menunggu" &&
              item.status === "sukses" &&
              item.metode !== "cash"
          ).length,
          totalVolume: rows
            .filter((item) => item.status === "sukses")
            .reduce((sum, item) => sum + item.total_bayar, 0),
          totalKomisi: rows
            .filter(
              (item) =>
                item.status_komisi === "belum_lunas" && item.status === "sukses"
            )
            .reduce((sum, item) => sum + item.komisi_platform, 0),
          pendapatanAdmin: 0,
          piutangKomisi: rows
            .filter(
              (item) =>
                item.status_komisi === "belum_lunas" && item.status === "sukses"
            )
            .reduce((sum, item) => sum + item.komisi_platform, 0),
          hariIni,
          totalPendapatan: rows
            .filter((item) => item.status === "sukses")
            .reduce((sum, item) => sum + item.pendapatan_owner, 0),
          komisiBelumSetor: rows.filter(
            (item) => item.status_komisi === "belum_lunas" && item.status === "sukses"
          ).length,
          totalKomisiHarusSetor: rows
            .filter(
              (item) =>
                item.status_komisi === "belum_lunas" && item.status === "sukses"
            )
            .reduce((sum, item) => sum + item.komisi_platform, 0),
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransaksi();
  }, [loadTransaksi]);

  const handleUpdate = async (id: string, data: TransaksiUpdateData) => {
    setActionLoading(true);
    try {
      const result = await updateTransaksi(id, data);
      setTransaksi((prev) =>
        prev.map((item) => (item.id === id ? result.data : item))
      );
      await loadTransaksi();
      return result.data;
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkKomisiLunas = async (id: string, catatan?: string) => {
    setActionLoading(true);
    try {
      await markKomisiLunas(id, catatan);
      await loadTransaksi();
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPayout = async (id: string, catatan?: string) => {
    setActionLoading(true);
    try {
      await markPayoutDicairkan(id, catatan);
      await loadTransaksi();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    transaksi,
    stats,
    loading,
    actionLoading,
    reload: loadTransaksi,
    updateTransaksi: handleUpdate,
    markKomisiLunas: handleMarkKomisiLunas,
    markPayoutDicairkan: handleMarkPayout,
  };
}
