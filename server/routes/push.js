const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getPublicKey, subscribe } = require('../controllers/pushController');

const router = express.Router();

router.get('/vapid-public-key', authMiddleware, getPublicKey);
router.post('/subscribe', authMiddleware, subscribe);

module.exports = router;
