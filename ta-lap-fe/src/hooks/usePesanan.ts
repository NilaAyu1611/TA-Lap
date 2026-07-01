import { useCallback, useEffect, useState } from "react";
import {
  createPesanan,
  deletePesanan,
  getAllPesanan,
  updatePesanan,
  updateStatusPesanan,
} from "@/services/pesanan.service";
import {
  Pesanan,
  PesananFormData,
  PesananStats,
  PesananStatus,
} from "@/types/pesanan";

export function usePesanan() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<PesananStats>({
    total: 0,
    pending: 0,
    dibayar: 0,
    selesai: 0,
    dibatalkan: 0,
    totalRevenue: 0,
  });

  const loadPesanan = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllPesanan();
      setPesanan(result.data);
      if (result.stats) {
        setStats(result.stats);
      } else {
        const rows = result.data;
        setStats({
          total: rows.length,
          pending: rows.filter((item) => item.status === "pending").length,
          dibayar: rows.filter((item) => item.status === "dibayar").length,
          selesai: rows.filter((item) => item.status === "selesai").length,
          dibatalkan: rows.filter((item) => item.status === "dibatalkan").length,
          totalRevenue: rows
            .filter((item) => ["dibayar", "selesai"].includes(item.status))
            .reduce((sum, item) => sum + item.total_harga, 0),
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPesanan();
  }, [loadPesanan]);

  const handleCreate = async (data: PesananFormData) => {
    setActionLoading(true);
    try {
      await createPesanan(data);
      await loadPesanan();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<PesananFormData>) => {
    setActionLoading(true);
    try {
      await updatePesanan(id, data);
      await loadPesanan();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: PesananStatus) => {
    setActionLoading(true);
    try {
      await updateStatusPesanan(id, status);
      await loadPesanan();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await deletePesanan(id);
      await loadPesanan();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    pesanan,
    stats,
    loading,
    actionLoading,
    reload: loadPesanan,
    createPesanan: handleCreate,
    updatePesanan: handleUpdate,
    updateStatus: handleUpdateStatus,
    deletePesanan: handleDelete,
  };
}
