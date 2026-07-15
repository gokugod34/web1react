const db = require('../../db/database');

module.exports = {
    findAll: () => {
        const stmt = db.prepare('SELECT id, name FROM categories ORDER BY id');
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, name FROM categories WHERE id = ?');
        return stmt.get(id);
    }
};
