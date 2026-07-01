function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function registerServiceWorker() {
  if (!isPushSupported()) return null;

  const existing = await navigator.serviceWorker.getRegistration("/sw.js");
  if (existing) return existing;

  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function subscribeBrowserPush(publicKey: string) {
  const registration = await registerServiceWorker();
  if (!registration) {
    throw new Error("Browser tidak mendukung notifikasi push.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Izin notifikasi ditolak. Aktifkan di pengaturan browser.");
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  return subscription.toJSON();
}

export async function unsubscribeBrowserPush() {
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return null;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return null;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  return endpoint;
}

export function getNotificationPermission() {
  if (!isPushSupported()) return "unsupported" as const;
  return Notification.permission;
}
