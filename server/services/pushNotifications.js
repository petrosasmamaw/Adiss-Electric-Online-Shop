const webpush = require('web-push');
const pool = require('../db/pool');

let configured = false;

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@addiselectric.com';

  if (!publicKey || !privateKey) {
    return false;
  }

  if (!configured) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    configured = true;
  }

  return true;
}

function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || null;
}

async function savePushSubscription(subscription) {
  const { endpoint, keys } = subscription;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new Error('Invalid push subscription payload');
  }

  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
     VALUES ($1, $2, $3)
     ON CONFLICT (endpoint)
     DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
    [endpoint, keys.p256dh, keys.auth]
  );
}

async function removePushSubscription(endpoint) {
  await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
}

async function notifyAdminsNewOrder(order) {
  if (!configureWebPush()) {
    return { sent: 0, skipped: true };
  }

  const result = await pool.query('SELECT endpoint, p256dh, auth FROM push_subscriptions');
  if (result.rows.length === 0) {
    return { sent: 0, skipped: false };
  }

  const payload = JSON.stringify({
    title: 'New order received',
    body: `${order.item_name} · ${order.customer_name} · Qty ${order.quantity}`,
    tag: `order-${order.id}`,
    url: '/admin/dashboard/orders',
    orderId: order.id,
  });

  let sent = 0;

  await Promise.all(
    result.rows.map(async (row) => {
      const subscription = {
        endpoint: row.endpoint,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth,
        },
      };

      try {
        await webpush.sendNotification(subscription, payload);
        sent += 1;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await removePushSubscription(row.endpoint);
        } else {
          console.error('Push notification failed:', err.message);
        }
      }
    })
  );

  return { sent, skipped: false };
}

module.exports = {
  getVapidPublicKey,
  savePushSubscription,
  notifyAdminsNewOrder,
};
