const express = require('express');
const {
  getOrders,
  createOrder,
  deleteOrder,
} = require('../controllers/ordersController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.post('/', createOrder);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
