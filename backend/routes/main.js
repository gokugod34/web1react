const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('pages/index', { title: 'Home' });
});

router.get('/products', (req, res) => {
    res.status(200).render('pages/product', { title: 'Productos' });
});

router.get('/cart', (req, res) => {
    res.status(200).render('pages/cart', { title: 'Carrito' });
});

router.get('/checkout', (req, res) => {
    res.status(200).render('pages/checkout', { title: 'Checkout' });
});

router.get('/register', (req, res) => {
    res.status(200).render('pages/register', { title: 'Registro' });
});

router.get('/login', (req, res) => {
    res.status(200).render('pages/login', { title: 'Iniciar Sesión' });
});

module.exports = router;
