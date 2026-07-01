self.addEventListener("push", (event) => {
  let payload = {
    title: "TA-LAP",
    body: "Anda punya notifikasi baru.",
    url: "/",
    tag: "talap-notification",
  };

  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch {
    /* ignore malformed payload */
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/images/login-lapangan.png",
      badge: "/images/login-lapangan.png",
      tag: payload.tag || "talap-notification",
      data: { url: payload.url || "/" },
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(absoluteUrl);
      }
      return undefined;
    })
  );
});
