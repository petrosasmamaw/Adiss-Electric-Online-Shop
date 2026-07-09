/* eslint-disable no-restricted-globals */
// Service worker handlers for PWA push + notification clicks (imported by Workbox SW).

self.addEventListener('push', (event) => {
  let payload = {
    title: 'New order received',
    body: 'A customer placed a new order.',
    tag: 'new-order',
    url: '/admin/dashboard/orders',
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: '/pwa/pwa-192x192.png',
    badge: '/favicon-48x48.png',
    tag: payload.tag || 'new-order',
    renotify: true,
    data: {
      url: payload.url || '/admin/dashboard/orders',
      orderId: payload.orderId ?? null,
    },
    vibrate: [180, 80, 180],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/admin/dashboard/orders';
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/admin') && 'focus' in client) {
            client.navigate?.(absoluteUrl);
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
