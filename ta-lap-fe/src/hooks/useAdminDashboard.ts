"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/dashboard.service";
import { AdminDashboardData } from "@/types/adminDashboard";
import { getApiErrorMessage } from "@/hooks/usePesananFormOptions";

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminDashboard();
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err, "Gagal memuat dashboard"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
