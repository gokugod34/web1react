const productService = require('../services/productService');
const categoryService = require('../services/categoryService');
const userService = require('../services/userService');

const toNumberOrDefault = (value, fallback = 0) => {
    if (value === '' || value === undefined || value === null) {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    createProduct: (req, res) => {
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

        const newProduct = productService.create({
            name,
            description,
            price,
            image,
            stock
        });

        return res.status(201).json(newProduct);
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
    },

    getCategoryById: (req, res) => {
        const category = categoryService.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        return res.json(category);
    },

    createCategory: (req, res) => {
        const body = req.body || {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const description = typeof body.description === 'string' ? body.description : '';

        if (!name) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        const newCategory = categoryService.create({ name, description });
        return res.status(201).json(newCategory);
    },

    updateCategory: (req, res) => {
        const categoryId = req.params.id;
        const existingCategory = categoryService.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const body = req.body || {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const description = typeof body.description === 'string' ? body.description : '';

        if (!name) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        const updatedCategory = categoryService.update(categoryId, { name, description });
        return res.json(updatedCategory);
    },

    deleteCategory: (req, res) => {
        const categoryId = req.params.id;
        const existingCategory = categoryService.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        categoryService.remove(categoryId);
        return res.status(204).send();
    },

    listUsers: (req, res) => {
        res.json(userService.findAll());
    },

    getUserById: (req, res) => {
        const user = userService.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json(user);
    },

    createUser: (req, res) => {
        const body = req.body || {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';

        if (!name) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'El email es requerido y debe tener un formato válido' });
        }

        try {
            const newUser = userService.create({ name, email });
            return res.status(201).json(newUser);
        } catch (err) {
            return res.status(400).json({ error: err.message || 'No se pudo crear el usuario' });
        }
    },

    updateUser: (req, res) => {
        const userId = req.params.id;
        const existingUser = userService.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const body = req.body || {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';

        if (!name) {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'El email es requerido y debe tener un formato válido' });
        }

        try {
            const updatedUser = userService.update(userId, { name, email });
            return res.json(updatedUser);
        } catch (err) {
            return res.status(400).json({ error: err.message || 'No se pudo actualizar el usuario' });
        }
    },

    deleteUser: (req, res) => {
        const userId = req.params.id;
        const existingUser = userService.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        userService.remove(userId);
        return res.status(204).send();
    }
};

module.exports = apiController;
