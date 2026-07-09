const express = require('express');
const {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
  markOrderSeen,
  markAllOrdersSeen,
} = require('../controllers/ordersController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/', createOrder);
router.patch('/mark-all-seen', authMiddleware, markAllOrdersSeen);
router.patch('/:id/seen', authMiddleware, markOrderSeen);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
