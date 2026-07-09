export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function showOrderBrowserNotification(order, onClick) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return null;

  const title = 'New order received';
  const body = `${order.item_name} · ${order.customer_name} · Qty ${order.quantity}`;

  const notification = new Notification(title, {
    body,
    icon: '/favicon-48x48.png',
    badge: '/favicon-48x48.png',
    tag: `order-${order.id}`,
    renotify: true,
  });

  notification.onclick = () => {
    window.focus();
    onClick?.(order);
    notification.close();
  };

  return notification;
}
