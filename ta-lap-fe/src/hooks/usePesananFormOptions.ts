import { useCallback, useEffect, useState } from "react";
import { getLapangan } from "@/services/lapangan.service";
import { getUsers } from "@/services/user.service";
import { Lapangan } from "@/types/lapangan";
import { User } from "@/types/user";

type OptionsCache = {
  users: User[];
  lapangan: Lapangan[];
  loadedAt: number;
};

let cache: OptionsCache | null = null;
const CACHE_MS = 5 * 60 * 1000;

export function usePesananFormOptions(
  enabled = true,
  variant: "admin" | "owner" = "admin"
) {
  const [users, setUsers] = useState<User[]>(cache?.users ?? []);
  const [lapangan, setLapangan] = useState<Lapangan[]>(cache?.lapangan ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState("");

  const load = useCallback(async (force = false) => {
    const now = Date.now();
    if (
      !force &&
      cache &&
      now - cache.loadedAt < CACHE_MS &&
      variant === "admin"
    ) {
      setUsers(cache.users);
      setLapangan(cache.lapangan);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const lapanganRes = await getLapangan();
      const activeLapangan = lapanganRes.data.filter(
        (item) => item.status !== false
      );

      if (variant === "owner") {
        setUsers([]);
        setLapangan(activeLapangan);
        setLoading(false);
        return;
      }

      const usersRes = await getUsers();

      cache = {
        users: usersRes.data,
        lapangan: activeLapangan,
        loadedAt: Date.now(),
      };

      setUsers(usersRes.data);
      setLapangan(activeLapangan);
    } catch (err: unknown) {
      const message = getApiErrorMessage(
        err,
        "Gagal memuat data customer dan lapangan"
      );
      setError(message);
      if (cache) {
        setUsers(cache.users);
        setLapangan(cache.lapangan);
      }
    } finally {
      setLoading(false);
    }
  }, [variant]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load, variant]);

  return { users, lapangan, loading, error, reload: () => load(true) };
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan"
): string {
  const axiosErr = err as {
    message?: string;
    response?: { status?: number; data?: { message?: string; error?: string } };
  };

  if (axiosErr.response?.status === 401) {
    return "Sesi login habis. Silakan login ulang.";
  }

  if (axiosErr.response?.status === 502) {
    const data = axiosErr.response?.data as { message?: string; error?: string };
    return [data?.message, data?.error].filter(Boolean).join(" — ") ||
      "Payment gateway Midtrans menolak kunci API.";
  }

  if (axiosErr.response?.data?.message) {
    return axiosErr.response.data.message;
  }

  const errorField = (axiosErr.response?.data as { error?: string } | undefined)
    ?.error;
  if (errorField) {
    return errorField;
  }

  if (
    axiosErr.message === "Network Error" ||
    axiosErr.message?.includes("ERR_CONNECTION_REFUSED")
  ) {
    return "Backend tidak merespons. Jalankan server ta-lap-be (npm run dev) di port 3002.";
  }

  return axiosErr.message || fallback;
}
