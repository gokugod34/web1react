const db = require('../../db/database');

const isUniqueConstraintError = (err) =>
    err && (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT');

module.exports = {
    findAll: () => {
        const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id');
        return stmt.all();
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
        return stmt.get(id);
    },

    findByEmail: (email) => {
        const stmt = db.prepare('SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?');
        return stmt.get(email);
    },

    create: (data = {}) => {
        const payload = data || {};
        const name = typeof payload.name === 'string' ? payload.name.trim() : '';
        const email = typeof payload.email === 'string' ? payload.email.trim() : '';
        const passwordHash = typeof payload.password_hash === 'string' ? payload.password_hash : null;
        const role = typeof payload.role === 'string' && payload.role ? payload.role : 'cliente';

        try {
            const stmt = db.prepare(`
                INSERT INTO users (name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `);

            const result = stmt.run(name, email, passwordHash, role);
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
        let role = typeof payload.role === 'string' && payload.role ? payload.role : undefined;
        if (role === undefined) {
            const existing = module.exports.findById(id);
            role = existing ? existing.role : 'cliente';
        }

        try {
            const stmt = db.prepare(`
                UPDATE users
                SET name = ?, email = ?, role = ?
                WHERE id = ?
            `);

            stmt.run(name, email, role, id);
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
