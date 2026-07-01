import { useCallback, useEffect, useState } from "react";
import { getOwnerLaporanKeuangan } from "@/services/laporan.service";
import { OwnerLaporanKeuangan } from "@/types/ownerLaporan";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";

export function useOwnerLaporan() {
  const [data, setData] = useState<OwnerLaporanKeuangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOwnerLaporanKeuangan();
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

  return { data, loading, error, reload: load };
}
