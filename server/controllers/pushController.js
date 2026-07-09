const {
  getVapidPublicKey,
  savePushSubscription,
} = require('../services/pushNotifications');

function getPublicKey(req, res) {
  const publicKey = getVapidPublicKey();

  if (!publicKey) {
    return res.status(503).json({
      success: false,
      error: 'Push notifications are not configured on the server',
    });
  }

  return res.json({ success: true, data: { publicKey } });
}

async function subscribe(req, res) {
  try {
    const subscription = req.body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({
        success: false,
        error: 'A valid push subscription is required',
      });
    }

    await savePushSubscription(subscription);
    return res.json({ success: true });
  } catch (err) {
    console.error('subscribe push error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to save push subscription' });
  }
}

module.exports = { getPublicKey, subscribe };
