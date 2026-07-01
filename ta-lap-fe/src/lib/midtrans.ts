"use client";

import { useCallback, useEffect, useState } from "react";

export type PaymentChannel = "qris" | "transfer" | "ewallet" | "all";

type SnapCallbacks = {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: SnapCallbacks) => void;
    };
  }
}

export function getSnapScriptUrl(isSandbox: boolean) {
  return isSandbox
    ? "https://app.sandbox.midtrans.com/snap/snap.js"
    : "https://app.midtrans.com/snap/snap.js";
}

/** Muat / ganti script Snap — client key & environment harus sama dengan backend yang buat token */
export function loadMidtransSnap(
  clientKey: string,
  isSandbox: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptId = "midtrans-snap-script";
    const expectedUrl = getSnapScriptUrl(isSandbox);
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existing) {
      const sameKey = existing.getAttribute("data-client-key") === clientKey;
      const sameEnv =
        existing.getAttribute("data-sandbox") === String(isSandbox);
      if (sameKey && sameEnv && window.snap) {
        resolve();
        return;
      }
      existing.remove();
      delete window.snap;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = expectedUrl;
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-sandbox", String(isSandbox));
    script.onload = () => {
      if (window.snap) resolve();
      else reject(new Error("Midtrans Snap gagal dimuat"));
    };
    script.onerror = () =>
      reject(new Error("Gagal memuat script Midtrans Snap"));
    document.body.appendChild(script);
  });
}

export function openMidtransSnap(token: string, callbacks: SnapCallbacks = {}) {
  if (!window.snap) {
    callbacks.onError?.();
    return;
  }

  window.snap.pay(token, {
    onSuccess: callbacks.onSuccess,
    onPending: callbacks.onPending,
    onError: callbacks.onError,
    onClose: callbacks.onClose,
  });
}

export function useMidtransSnap(clientKey: string | null, isSandbox = true) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientKey) {
      setReady(false);
      return;
    }

    let cancelled = false;

    loadMidtransSnap(clientKey, isSandbox)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientKey, isSandbox]);

  const openSnap = useCallback(
    (token: string, callbacks: SnapCallbacks = {}) => {
      openMidtransSnap(token, callbacks);
    },
    []
  );

  return { ready, openSnap };
}
