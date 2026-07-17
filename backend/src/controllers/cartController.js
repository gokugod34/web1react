const cartService = require('../services/cartService');
const normalizeId = require('../utils/normalizeId');

const cartController = {
    list: (req, res) => {
        const cart = cartService.normalizeCart(req.session.cart);
        const productsInCart = cartService.getCartProducts(cart);
        const total = cartService.calculateTotal(cart);

        res.render('pages/cart', {
            title: 'Mi Carrito',
            products: productsInCart,
            total
        });
    },

    add: (req, res) => {
        const { id: productId, valid, exists } = normalizeId(req.body.productId || req.params.id);
        if (!valid) {
            return res.status(400).send('ID inválido');
        }

        if (!exists) {
            return res.status(404).render('not-found', { title: 'Producto no encontrado' });
        }

        const product = cartService.getProduct(productId);
        if (product.stock === 0) {
            return res.redirect('/products/' + productId);
        }

        req.session.cart = cartService.addItem(req.session.cart, productId);
        res.redirect('/cart');
    },

    update: (req, res) => {
        const { id: productId, valid, exists } = normalizeId(req.body.productId);
        if (!valid) {
            return res.status(400).send('ID inválido');
        }

        if (!exists) {
            return res.status(404).render('not-found', { title: 'Producto no encontrado' });
        }

        const { action } = req.body;
        req.session.cart = cartService.updateQuantity(req.session.cart, productId, action);
        res.redirect('/cart');
    },

    remove: (req, res) => {
        const { id: productId, valid, exists } = normalizeId(req.body.productId);
        if (!valid) {
            return res.status(400).send('ID inválido');
        }

        if (!exists) {
            return res.status(404).render('not-found', { title: 'Producto no encontrado' });
        }

        req.session.cart = cartService.removeItem(req.session.cart, productId);
        res.redirect('/cart');
    },

    clear: (req, res) => {
        req.session.cart = cartService.clearCart();
        res.redirect('/cart');
    },

    checkout: (req, res) => {
        res.status(200).render('pages/checkout', { title: 'Checkout Temporal' });
    }
};

module.exports = cartController;
