import { useCallback, useEffect, useState } from "react";
import { getOwnerDashboard } from "@/services/dashboard.service";
import { OwnerDashboardData } from "@/types/ownerDashboard";

export function useOwnerDashboard() {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOwnerDashboard();
      setData(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        "Gagal memuat dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
