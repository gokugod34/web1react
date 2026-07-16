import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductView.css';

const buildFormState = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? 0,
  stock: product?.stock ?? 0,
  image: product?.image ?? ''
});

const toIntegerOrZero = (value) => {
  const normalized = Number(value);
  return Number.isInteger(normalized) ? normalized : 0;
};

const INVALID_NUMBER_KEYS = ['e', 'E', '+', '-'];

const blockInvalidNumberKeys = (event) => {
  if (INVALID_NUMBER_KEYS.includes(event.key)) {
    event.preventDefault();
  }
};

const STOCK_MIN = 0;
const STOCK_MAX = 20000;

const clampStock = (value) => Math.min(STOCK_MAX, Math.max(STOCK_MIN, value));

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState(buildFormState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo cargar el producto');
        }

        const data = await response.json();
        setProduct(data);
        setFormData(buildFormState(data));
      } catch (err) {
        setError(err.message || 'Error de red al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setFormData(buildFormState(product));
    setSubmitError('');
  };

  const handleStockChange = (nextValue) => {
    const numericValue = Number(nextValue);

    if (Number.isNaN(numericValue)) {
      updateField('stock', '');
      return;
    }

    updateField('stock', Math.trunc(numericValue));
  };

  const handleStockBlur = () => {
    const numericValue = Number(formData.stock);
    const normalized = Number.isNaN(numericValue) ? STOCK_MIN : clampStock(Math.trunc(numericValue));
    updateField('stock', normalized);
  };

  const adjustStock = (delta) => {
    const current = Number(formData.stock);
    const base = Number.isNaN(current) ? STOCK_MIN : Math.trunc(current);
    updateField('stock', clampStock(base + delta));
  };

  const handleSave = async () => {
    const trimmedName = String(formData.name).trim();
    const priceValue = Number(formData.price);
    const stockValue = Number(formData.stock);

    if (!trimmedName) {
      setSubmitError('El nombre es requerido');
      return;
    }

    if (!Number.isInteger(priceValue) || !Number.isInteger(stockValue)) {
      setSubmitError('El precio y el stock deben ser enteros');
      return;
    }

    try {
      setSubmitError('');

      const response = await fetch(`/api/products/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          description: formData.description,
          price: Number.isFinite(priceValue) ? priceValue : 0,
          image: formData.image,
          stock: Number.isFinite(stockValue) ? stockValue : 0
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo guardar el producto');
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setFormData(buildFormState(updatedProduct));
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar el producto');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${id}/delete`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo eliminar el producto');
      }

      navigate('/products');
    } catch (err) {
      setSubmitError(err.message || 'No se pudo eliminar el producto');
    }
  };

  if (loading) {
    return <p className="products-status">Cargando…</p>;
  }

  if (error) {
    return <p className="products-status products-status--error">{error}</p>;
  }

  return (
    <section className="product-view-page">
      <header className="product-view-header">
        <h1 className="product-view-title">Productos &gt; #{id}</h1>
        <button className="product-view-delete-button" type="button" onClick={handleDelete}>
          Eliminar
        </button>
      </header>

      <div className="product-view-grid">
        <article className="product-view-card">
          <h2>Resumen</h2>

          <div className="product-view-meta">
            <div className="product-view-meta-item">
              <span className="product-view-meta-label">Nombre</span>
              <span className="product-view-meta-value">{product?.name}</span>
            </div>
            <div className="product-view-meta-item">
              <span className="product-view-meta-label">Identificador</span>
              <span className="product-view-meta-value">#{product?.id}</span>
            </div>
            <div className="product-view-meta-item">
              <span className="product-view-meta-label">Stock</span>
              <span className="product-view-meta-value">{product?.stock}</span>
            </div>
            <div className="product-view-meta-item">
              <span className="product-view-meta-label">Precio</span>
              <span className="product-view-meta-value">${Number(product?.price ?? 0).toLocaleString('es-AR')}</span>
            </div>
            <div className="product-view-meta-item">
              <span className="product-view-meta-label">Categoría / Tienda</span>
              <span className="product-view-meta-value">{product?.category || 'Sin categoría'}</span>
            </div>
          </div>

          {product?.image ? (
            <img className="product-view-image" src={product.image} alt={product.name} />
          ) : null}
        </article>

        <section className="product-view-form">
          <h2>Editar producto</h2>

          <div className="product-view-field">
            <label htmlFor="product-name">Nombre</label>
            <input
              id="product-name"
              type="text"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </div>

          <div className="product-view-field">
            <label htmlFor="product-description">Descripción</label>
            <textarea
              id="product-description"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </div>

          <div className="product-view-field">
            <label htmlFor="product-price">Precio</label>
            <input
              id="product-price"
              type="number"
              className="product-view-input-number"
              value={formData.price}
              onChange={(event) => updateField('price', event.target.value)}
              onKeyDown={blockInvalidNumberKeys}
            />
          </div>

          <div className="product-view-field">
            <label htmlFor="product-stock">Stock</label>
            <div className="product-view-stock-control">
              <input
                id="product-stock"
                type="number"
                className="product-view-input-number product-view-stock-input"
                value={formData.stock}
                onChange={(event) => handleStockChange(event.target.value)}
                onKeyDown={blockInvalidNumberKeys}
                onBlur={handleStockBlur}
              />
              <div className="product-view-stepper">
                <button
                  type="button"
                  onClick={() => adjustStock(-1)}
                  disabled={Number(formData.stock) <= STOCK_MIN}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => adjustStock(1)}
                  disabled={Number(formData.stock) >= STOCK_MAX}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="product-view-field">
            <label htmlFor="product-image">Imagen (URL)</label>
            <div className="product-view-stock-row">
              <input
                id="product-image"
                type="text"
                value={formData.image}
                onChange={(event) => updateField('image', event.target.value)}
              />
              <button
                className="product-view-button product-view-button--secondary"
                type="button"
                onClick={() => updateField('image', '')}
              >
                Quitar imagen
              </button>
            </div>
          </div>

          {submitError ? <p className="product-view-error">{submitError}</p> : null}

          <div className="product-view-actions">
            <button className="product-view-button product-view-button--secondary" type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="product-view-button" type="button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}