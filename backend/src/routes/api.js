const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.get('/products', apiController.listProducts);
router.post('/products/new', apiController.createProduct);
router.get('/products/:id', apiController.getProductById);
router.put('/products/:id/edit', apiController.updateProduct);
router.delete('/products/:id/delete', apiController.deleteProduct);
router.get('/categories', apiController.listCategories);

module.exports = router;
