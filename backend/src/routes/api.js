const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.get('/products', apiController.listProducts);
router.post('/products/new', apiController.createProduct);
router.get('/products/:id', apiController.getProductById);
router.put('/products/:id/edit', apiController.updateProduct);
router.delete('/products/:id/delete', apiController.deleteProduct);
router.get('/categories', apiController.listCategories);
router.post('/categories/new', apiController.createCategory);
router.get('/categories/:id', apiController.getCategoryById);
router.put('/categories/:id/edit', apiController.updateCategory);
router.delete('/categories/:id/delete', apiController.deleteCategory);
router.get('/users', apiController.listUsers);
router.post('/users/new', apiController.createUser);
router.get('/users/:id', apiController.getUserById);
router.put('/users/:id/edit', apiController.updateUser);
router.delete('/users/:id/delete', apiController.deleteUser);

module.exports = router;
