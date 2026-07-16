const db = require('../../db/database');

const SELECT_PRODUCT_BASE = `
    SELECT p.id, p.name, p.description, p.price, p.image, p.stock, p.created_at,
                 c.id AS category_id, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
`;

module.exports = {
    findAll: () => {
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` ORDER BY p.id`);
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` WHERE p.id = ?`);
        return stmt.get(id);
    },

    update: (id, data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const description = typeof payload.description === 'string' ? payload.description : '';
        const price = Number(payload.price);
        const image = typeof payload.image === 'string' ? payload.image.trim() : '';
        const stock = Number(payload.stock);

        const stmt = db.prepare(`
            UPDATE products
            SET name = ?, description = ?, price = ?, image = ?, stock = ?
            WHERE id = ?
        `);

        stmt.run(name, description, price, image, stock, id);
        return module.exports.findById(id);
    },

    remove: (id) => {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        return stmt.run(id);
    },

    findByCategory: (category) => {
        if (!category) return [];
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` WHERE lower(c.name) = lower(?) ORDER BY p.id`);
        return stmt.all(category);
    },

    search: (query) => {
        if (!query || String(query).trim() === '') return [];
        const q = `%${String(query).trim().toLowerCase()}%`;
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` WHERE lower(p.name) LIKE ? OR lower(p.description) LIKE ? ORDER BY p.id`);
        return stmt.all(q, q);
    },

    sortByPrice: (direction = 'asc') => {
        const dir = String(direction).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` ORDER BY p.price ${dir}`);
        return stmt.all();
    },

    getRelated: (productId, limit = 4) => {
        const product = module.exports.findById(productId);
        if (!product || !product.category_id) return [];
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` WHERE p.category_id = ? AND p.id != ? ORDER BY p.id LIMIT ?`);
        return stmt.all(product.category_id, productId, limit);
    },

    getSuggested: (limit = 10) => {
        const stmt = db.prepare(SELECT_PRODUCT_BASE + ` WHERE p.stock > 0 ORDER BY p.created_at DESC LIMIT ?`);
        return stmt.all(limit);
    },

    // backward-compatible alias used by controllers
    getTopSellers: () => module.exports.getSuggested(10)
};
