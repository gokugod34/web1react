import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsList.css';

export default function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de productos');
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error de red al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="products-page">
      <header className="products-header">
        <h1 className="products-title">Productos</h1>

        <div className="products-toolbar">
          <input
            className="products-search"
            type="search"
            placeholder="Buscar producto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar producto"
          />

          <button
            className="products-add-button"
            type="button"
            onClick={() => navigate('/products/new')}
          >
            Agregar Producto
          </button>
        </div>
      </header>

      {loading ? (
        <p className="products-status">Cargando…</p>
      ) : error ? (
        <p className="products-status products-status--error">{error}</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/products/${product.id}`);
                }
              }}
            >
              <div className="product-image-wrap">
                {product.image ? (
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="product-image product-image--placeholder">Sin imagen</div>
                )}
              </div>

              <div className="product-body">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">${Number(product.price).toLocaleString('es-AR')}</span>
                  <span className="product-stock">Stock: {product.stock}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}