import { useCallback, useEffect, useState } from "react";
import {
  createPengeluaran,
  deletePengeluaran,
  getLaporanKeuangan,
} from "@/services/laporan.service";
import { LaporanKeuangan, PengeluaranFormData } from "@/types/laporan";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";

export function useLaporanKeuangan() {
  const [data, setData] = useState<LaporanKeuangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLaporanKeuangan();
      setData(result);
    } catch (err) {
      setData(null);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addPengeluaran = async (form: PengeluaranFormData) => {
    await createPengeluaran(form);
    await load();
  };

  const removePengeluaran = async (id: string) => {
    await deletePengeluaran(id);
    await load();
  };

  return { data, loading, error, reload: load, addPengeluaran, removePengeluaran };
}
