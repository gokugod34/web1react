const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.get('/products', apiController.listProducts);
router.get('/categories', apiController.listCategories);

module.exports = router;
