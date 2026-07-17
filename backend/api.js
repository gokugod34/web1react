const express = require('express');
const router = express.Router();
const db = require('./db/database');

// Inicialización de la base de datos de productos en SQLite
try {
  // Desactivar temporalmente foreign keys para poder reconstruir la tabla sin conflictos
  db.prepare('PRAGMA foreign_keys = OFF').run();
  db.prepare('DROP TABLE IF EXISTS order_items').run();
  db.prepare('DROP TABLE IF EXISTS products').run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      categoria TEXT,
      descripcion TEXT
    )
  `).run();

  db.prepare('PRAGMA foreign_keys = ON').run();
  console.log('Base de datos SQLite: Tabla productos recreada con id TEXT PRIMARY KEY.');

  // Inserción de producto semilla
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (count === 0) {
    db.prepare(`
      INSERT INTO products (id, nombre, precio, stock, categoria, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      '1', 
      'Buzo Oversize Vimet', 
      25000, 
      15, 
      'Ropa', 
      'Buzo clásico de algodón con corte oversize y capucha ajustable.'
    );
    console.log('Producto semilla "Buzo Oversize Vimet" insertado con éxito.');
  }
} catch (err) {
  console.error('Error inicializando base de datos de productos:', err.message);
}

/* API ENDPOINTS */

// GET /api/productos: Retorna todos los productos (ordenados por ID descendente)
router.get('/api/productos', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error en GET /api/productos:', err.message);
    res.status(500).json({ error: 'Error al obtener la lista de productos' });
  }
});

// GET /api/productos/:id: Retorna un producto específico por ID
router.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(`Error en GET /api/productos/${id}:`, err.message);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// POST /api/productos: Inserta un nuevo producto
router.post('/api/productos', (req, res) => {
  const { id, nombre, precio, stock, categoria, descripcion } = req.body;
  const productId = id || `#VIM-${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO products (id, nombre, precio, stock, categoria, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      productId, 
      nombre, 
      Number(precio) || 0, 
      Number(stock) || 0, 
      categoria, 
      descripcion
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error en POST /api/productos:', err.message);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// PUT /api/productos/:id: Actualiza un producto existente
router.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, categoria, descripcion } = req.body;
  try {
    const result = db.prepare(`
      UPDATE products
      SET nombre = ?, precio = ?, stock = ?, categoria = ?, descripcion = ?
      WHERE id = ?
    `).run(
      nombre, 
      Number(precio) || 0, 
      Number(stock) || 0, 
      categoria, 
      descripcion, 
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(`Error en PUT /api/productos/${id}:`, err.message);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE /api/productos/:id: Elimina un producto
router.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(`Error en DELETE /api/productos/${id}:`, err.message);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
