import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsList.css';

export default function ProductsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carga de productos desde el backend real
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('http://localhost:3000/api/productos');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de productos desde el servidor');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(p => 
      (p.name || '').toLowerCase().includes(term) ||
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.categoria || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      (p.descripcion || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('No se pudo eliminar el producto en el servidor');
        }
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error eliminando producto:', err);
        alert(err.message);
      }
    }
  };

  return (
    <section className="products-page">
      <header className="products-header">
        <h1 className="products-title">📦 Productos</h1>

        <div className="products-toolbar">
          <input
            className="products-search"
            type="search"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar producto"
          />

          <button
            className="products-add-button"
            type="button"
            onClick={() => navigate('/productos/nuevo')}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </header>

      {loading ? (
        <div className="products-table-container">
          <p className="products-empty-msg">Cargando productos desde el servidor...</p>
        </div>
      ) : error ? (
        <div className="products-table-container">
          <p className="products-empty-msg" style={{ color: '#e74c3c' }}>{error}</p>
        </div>
      ) : (
        <div className="products-table-container">
          {filteredProducts.length === 0 ? (
            <p className="products-empty-msg">No se encontraron productos.</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th className="actions-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-id">#{product.id}</td>
                    <td 
                      className="product-name-cell"
                      onClick={() => navigate(`/productos/${product.id}`)}
                    >
                      {product.nombre || product.name}
                    </td>
                    <td>
                      <span className="product-category-tag">{product.categoria || product.category || 'Ropa'}</span>
                    </td>
                    <td className="product-price-cell">
                      ${Number(product.precio || product.price || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="product-stock-cell">
                      <span className={`stock-status ${Number(product.stock) < 10 ? 'stock-low' : 'stock-ok'}`}>
                        {product.stock} u.
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => navigate(`/productos/editar/${product.id}`)}
                      >
                        ✍🏻 Editar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}