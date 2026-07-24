const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

// --- PRODUCTOS ---
router.get('/products', apiController.listProducts);
router.post('/products', apiController.createProduct);
router.get('/products/:id', apiController.getProductById);
router.put('/products/:id', apiController.updateProduct);
router.delete('/products/:id', apiController.deleteProduct);

// --- CATEGORÍAS ---

router.get('/categories', apiController.listCategories);
router.get('/categories/:id', apiController.getCategoryById);
router.post('/categories', apiController.createCategory); 
router.put('/categories/:id', apiController.updateCategory); 
router.delete('/categories/:id', apiController.deleteCategory); 

// --- USUARIOS ---

router.get('/users', apiController.listUsers);
router.get('/users/:id', apiController.getUserById);
router.post('/users', apiController.createUser);
router.put('/users/:id', apiController.updateUser);
router.delete('/users/:id', apiController.deleteUser);

// --- MÉTRICAS ---

router.get('/stats', apiController.getStats);

module.exports = router;