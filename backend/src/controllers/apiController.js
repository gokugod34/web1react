const productService = require('../services/productService');
const categoryService = require('../services/categoryService');

const apiController = {
    listProducts: (req, res) => {
        res.json(productService.findAll());
    },

    listCategories: (req, res) => {
        res.json(categoryService.findAll());
    }
};

module.exports = apiController;
