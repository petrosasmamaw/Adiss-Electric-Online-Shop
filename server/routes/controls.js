const express = require('express');
const { getControls, updateControls } = require('../controllers/controlsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', getControls);
router.patch('/', authMiddleware, updateControls);

module.exports = router;

