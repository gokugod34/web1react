const productService = require('../services/productService');

const normalizeId = (id) => {
    if (id === undefined || id === null) {
        return { id: null, valid: false, exists: false };
    }

    const stringId = String(id).trim();
    if (!/^[0-9]+$/.test(stringId)) {
        return { id: null, valid: false, exists: false };
    }

    const numericId = Number(stringId);
    const exists = Boolean(productService.findById(numericId));
    return { id: numericId, valid: true, exists };
};

module.exports = normalizeId;
