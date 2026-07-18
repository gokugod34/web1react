const db = require('../../db/database');

const isUniqueConstraintError = (err) =>
    err && (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT');

module.exports = {
    findAll: () => {
        const stmt = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY id');
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
        return stmt.get(id);
    },

    create: (data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const email = typeof payload.email === 'string' ? payload.email.trim() : '';

        try {
            const stmt = db.prepare(`
                INSERT INTO users (name, email, password_hash)
                VALUES (?, ?, NULL)
            `);

            const result = stmt.run(name, email);
            return module.exports.findById(result.lastInsertRowid);
        } catch (err) {
            if (isUniqueConstraintError(err)) {
                throw new Error('Ese email ya está registrado');
            }
            throw err;
        }
    },

    update: (id, data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const email = typeof payload.email === 'string' ? payload.email.trim() : '';

        try {
            const stmt = db.prepare(`
                UPDATE users
                SET name = ?, email = ?
                WHERE id = ?
            `);

            stmt.run(name, email, id);
            return module.exports.findById(id);
        } catch (err) {
            if (isUniqueConstraintError(err)) {
                throw new Error('Ese email ya está registrado');
            }
            throw err;
        }
    },

    remove: (id) => {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        return stmt.run(id);
    }
};
