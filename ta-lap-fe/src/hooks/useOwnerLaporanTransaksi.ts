import { useCallback, useEffect, useState } from "react";
import { getOwnerLaporanTransaksi } from "@/services/laporan.service";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";
import { Transaksi } from "@/types/transaksi";

export function useOwnerLaporanTransaksi(enabled = true) {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOwnerLaporanTransaksi();
      setTransaksi(result.data);
    } catch (err) {
      setTransaksi([]);
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { transaksi, loading, error, reload: load };
}
