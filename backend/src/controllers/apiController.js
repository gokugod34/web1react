const productService = require('../services/productService');
const categoryService = require('../services/categoryService');

const toNumberOrDefault = (value, fallback = 0) => {
    if (value === '' || value === undefined || value === null) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const apiController = {
    listProducts: (req, res) => {
        res.json(productService.findAll());
    },

    getProductById: (req, res) => {
        const product = productService.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(product);
    },

    updateProduct: (req, res) => {
        const productId = req.params.id;
        const existingProduct = productService.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const body = req.body || {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const description = typeof body.description === 'string' ? body.description : '';
        const price = toNumberOrDefault(body.price, 0);
        const stock = toNumberOrDefault(body.stock, 0);
        const image = typeof body.image === 'string' ? body.image.trim() : '';

        if (!name) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        if (!Number.isInteger(price) || !Number.isInteger(stock)) {
            return res.status(400).json({ error: 'El precio y el stock deben ser números enteros' });
        }

        const updatedProduct = productService.update(productId, {
            name,
            description,
            price,
            image,
            stock
        });

        return res.json(updatedProduct);
    },

    deleteProduct: (req, res) => {
        const productId = req.params.id;
        const existingProduct = productService.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        productService.remove(productId);
        return res.status(204).send();
    },

    listCategories: (req, res) => {
        res.json(categoryService.findAll());
    }
};

module.exports = apiController;
