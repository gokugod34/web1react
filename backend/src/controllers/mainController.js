const productService = require('../services/productService');

const mainController = {
    index: (req, res) => {
        const products = productService.findAll();

        // Seleccionar únicamente 5 productos del array total
        const suggestedProducts = products.slice(0, 5);

        // Obtener los más pedidos desde el servicio
        const topSellers = productService.getTopSellers();

        res.render('pages/index', {
            title: 'Home',
            suggestedProducts,
            topSellers
        });
    }
};

module.exports = mainController;
