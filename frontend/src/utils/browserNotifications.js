import api from '../api/axiosConfig';

const ORDERS_URL = '/admin/dashboard/orders';

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

export function isPwaStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.ready;
  } catch {
    return null;
  }
}

function buildOrderNotificationPayload(order) {
  return {
    title: 'New order received',
    body: `${order.item_name} · ${order.customer_name} · Qty ${order.quantity}`,
    tag: `order-${order.id}`,
    url: ORDERS_URL,
    orderId: order.id,
    icon: '/pwa/pwa-192x192.png',
    badge: '/favicon-48x48.png',
    renotify: true,
    data: {
      url: ORDERS_URL,
      orderId: order.id,
    },
    vibrate: [180, 80, 180],
  };
}

export async function showOrderBrowserNotification(order) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return null;

  const payload = buildOrderNotificationPayload(order);
  const registration = await getServiceWorkerRegistration();

  if (registration?.showNotification) {
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      tag: payload.tag,
      renotify: payload.renotify,
      data: payload.data,
      vibrate: payload.vibrate,
    });
    return registration;
  }

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    tag: payload.tag,
    renotify: payload.renotify,
    data: payload.data,
  });

  notification.onclick = () => {
    window.focus();
    window.location.assign(ORDERS_URL);
    notification.close();
  };

  return notification;
}

async function fetchVapidPublicKey() {
  const { data } = await api.get('/push/vapid-public-key');
  return data.data.publicKey;
}

async function savePushSubscription(subscription) {
  await api.post('/push/subscribe', subscription.toJSON());
}

export async function subscribeToPushNotifications() {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return { ok: false, reason: 'unsupported' };
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration?.pushManager) {
    return { ok: false, reason: 'no-service-worker' };
  }

  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    await savePushSubscription(existing);
    return { ok: true, reason: 'existing' };
  }

  const publicKey = await fetchVapidPublicKey();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await savePushSubscription(subscription);
  return { ok: true, reason: 'subscribed' };
}

export async function enableOrderNotifications({ requestIfNeeded = true } = {}) {
  if (!isNotificationSupported()) {
    return { permission: 'unsupported', push: false };
  }

  let permission = Notification.permission;

  if (permission === 'default' && requestIfNeeded) {
    permission = await requestNotificationPermission();
  }

  if (permission !== 'granted') {
    return { permission, push: false };
  }

  if (!isPushSupported()) {
    return { permission, push: false };
  }

  try {
    const result = await subscribeToPushNotifications();
    return { permission, push: result.ok };
  } catch {
    return { permission, push: false };
  }
}
