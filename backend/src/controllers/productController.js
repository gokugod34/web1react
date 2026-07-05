const productService = require('../services/productService');
const normalizeId = require('../utils/normalizeId');

const productController = {
    showDetail: (req, res) => {
        const { id: productId, valid, exists } = normalizeId(req.params.id);
        if (!valid) {
            return res.status(400).send('ID inválido');
        }

        if (!exists) {
            return res.status(404).render('not-found', { title: 'Producto no encontrado' });
        }

        const product = productService.findById(productId);

        // Productos relacionados (misma categoría, excluyendo el actual)
        let relatedProducts = productService.findByCategory(product.category)
            .filter(p => String(p.id) !== String(product.id));
        
        // Si hay más de 4, seleccionamos 4 al azar
        if (relatedProducts.length > 4) {
            relatedProducts = relatedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
        }

        res.render('product-detail', { 
            title: `${product.name} - Vimet Store`, 
            product, 
            relatedProducts 
        });
    },

    showCategory: (req, res) => {
        const categoryName = req.params.category;
        const filteredProducts = productService.findByCategory(categoryName);

        res.render('category-list', {
            title: `Categoría: ${categoryName}`,
            categoryName: categoryName,
            products: filteredProducts
        });
    },

    list: (req, res) => {
        const { min, max, sort } = req.query;
        let products = productService.findAll();

        if (min && min.trim() !== '') {
            products = products.filter(p => p.price >= parseFloat(min));
        }

        if (max && max.trim() !== '') {
            products = products.filter(p => p.price <= parseFloat(max));
        }

        if (sort === 'asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products = products.sort((a, b) => b.price - a.price);
        }

        res.render('products', {
            title: 'Listado de Productos',
            products,
            min: min || '',
            max: max || '',
            sort: sort || '',
            searchQuery: ''
        });
    },

    search: (req, res) => {
        const query = req.query.query || '';
        const products = productService.search(query);

        res.render('products', {
            title: `Resultados de búsqueda: ${query}`,
            products,
            min: '',
            max: '',
            sort: '',
            searchQuery: query,
            emptyMessage: query
                ? `No se encontraron productos para "${query}".`
                : 'Ingrese un término de búsqueda para encontrar productos.'
        });
    }
};

module.exports = productController;
