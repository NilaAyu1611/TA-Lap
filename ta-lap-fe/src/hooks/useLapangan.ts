import { useCallback, useEffect, useState } from "react";
import {
  createLapangan,
  deleteLapangan,
  getLapangan,
  updateLapangan,
} from "@/services/lapangan.service";
import {
  Lapangan,
  LapanganFormData,
  LapanganStats,
} from "@/types/lapangan";

export function useLapangan() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState<LapanganStats>({
    total: 0,
    aktif: 0,
    nonaktif: 0,
  });

  const loadLapangan = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLapangan();
      setLapangan(result.data);
      if (result.stats) setStats(result.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLapangan();
  }, [loadLapangan]);

  const handleCreate = async (data: LapanganFormData) => {
    setActionLoading(true);
    try {
      await createLapangan(data);
      await loadLapangan();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<LapanganFormData>) => {
    setActionLoading(true);
    try {
      await updateLapangan(id, data);
      await loadLapangan();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteLapangan(id);
      await loadLapangan();
    } finally {
      setActionLoading(false);
    }
  };

  return {
    lapangan,
    stats,
    loading,
    actionLoading,
    reload: loadLapangan,
    createLapangan: handleCreate,
    updateLapangan: handleUpdate,
    deleteLapangan: handleDelete,
  };
}
