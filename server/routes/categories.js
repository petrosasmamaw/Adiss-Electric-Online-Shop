const express = require('express');
const {
  getCategories,
  searchCategories,
} = require('../controllers/categoriesController');

const router = express.Router();

router.get('/search', searchCategories);
router.get('/', getCategories);

module.exports = router;
