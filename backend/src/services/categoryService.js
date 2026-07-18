const db = require('../../db/database');

module.exports = {
    findAll: () => {
        const stmt = db.prepare('SELECT id, name, description FROM categories ORDER BY id');
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, name, description FROM categories WHERE id = ?');
        return stmt.get(id);
    },

    create: (data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const description = typeof payload.description === 'string' ? payload.description : '';

        const stmt = db.prepare(`
            INSERT INTO categories (name, description)
            VALUES (?, ?)
        `);

        const result = stmt.run(name, description);
        return module.exports.findById(result.lastInsertRowid);
    },

    update: (id, data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const description = typeof payload.description === 'string' ? payload.description : '';

        const stmt = db.prepare(`
            UPDATE categories
            SET name = ?, description = ?
            WHERE id = ?
        `);

        stmt.run(name, description, id);
        return module.exports.findById(id);
    },

    remove: (id) => {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        return stmt.run(id);
    }
};
