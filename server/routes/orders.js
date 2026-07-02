const express = require('express');
const {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} = require('../controllers/ordersController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/', createOrder);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
