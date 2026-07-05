const productService = require('./productService');

const normalizeCart = (cart) => Array.isArray(cart) ? cart : [];

const addItem = (cart, productId) => {
    const normalized = normalizeCart(cart);
    const existingIndex = normalized.findIndex(item => String(item.productId) === String(productId));

    if (existingIndex !== -1) {
        const updatedCart = [...normalized];
        updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + 1
        };
        return updatedCart;
    }

    return [...normalized, { productId, quantity: 1 }];
};

const removeItem = (cart, productId) => {
    const normalized = normalizeCart(cart);
    return normalized.filter(item => String(item.productId) !== String(productId));
};

const updateQuantity = (cart, productId, action) => {
    const normalized = normalizeCart(cart);
    return normalized.reduce((result, item) => {
        if (String(item.productId) !== String(productId)) {
            result.push(item);
            return result;
        }

        const quantity = action === 'increase'
            ? item.quantity + 1
            : action === 'decrease'
                ? item.quantity - 1
                : item.quantity;

        if (quantity > 0) {
            result.push({ ...item, quantity });
        }

        return result;
    }, []);
};

const clearCart = () => [];

const getProduct = (productId) => {
    return productService.findById(productId);
};

const productExists = (productId) => {
    return Boolean(getProduct(productId));
};

const getCartProducts = (cart) => {
    const normalized = normalizeCart(cart);

    return normalized
        .map(item => {
            const product = getProduct(item.productId);
            if (!product) return null;

            return {
                ...product,
                quantity: item.quantity,
                subtotal: product.price * item.quantity
            };
        })
        .filter(Boolean);
};

const calculateTotal = (cart) => {
    const products = getCartProducts(cart);
    return products.reduce((sum, product) => sum + product.subtotal, 0);
};

module.exports = {
    normalizeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartProducts,
    calculateTotal,
    getProduct,
    productExists
};
