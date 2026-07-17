import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductView.css';

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:3000/api/productos/${id}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar el producto desde el servidor');
          }
          const data = await response.json();
          setFormData({
            nombre: data.nombre || '',
            precio: data.precio !== undefined ? String(data.precio) : '',
            stock: data.stock !== undefined ? String(data.stock) : '',
            categoria: data.categoria || '',
            descripcion: data.descripcion || ''
          });
        } catch (err) {
          console.error('Error cargando producto para edición:', err);
          alert('Error: ' + (err.message || 'No se pudo conectar con el servidor.'));
          navigate('/productos');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    } else {
      setFormData({
        nombre: '',
        precio: '',
        stock: '',
        categoria: '',
        descripcion: ''
      });
    }
  }, [id, esEdicion, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = esEdicion ? `/api/productos/${id}` : '/api/productos';
      const method = esEdicion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: Number(formData.precio) || 0,
          stock: Number(formData.stock) || 0,
          categoria: formData.categoria,
          descripcion: formData.descripcion
        })
      });

      if (!response.ok) {
        throw new Error('Error al intentar guardar los datos del producto');
      }

      alert(`¡Producto ${esEdicion ? 'actualizado' : 'creado'} con éxito!`);
      navigate('/productos');
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      alert(err.message || 'Error de red al guardar el producto.');
    }
  };

  if (loading) {
    return (
      <div className="product-view-container">
        <p className="products-empty-msg">Cargando datos del producto...</p>
      </div>
    );
  }

  return (
    <div className="product-view-container">
      <header className="product-view-header">
        <h1 className="product-view-title">
          {esEdicion ? '✍🏻 Editar Producto' : '➕ Nuevo Producto'}
        </h1>
        <button 
          className="product-view-btn-back" 
          type="button" 
          onClick={() => navigate('/productos')}
        >
          Volver al listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="product-view-card">
        <div className="product-view-form-grid">
          {/* Nombre */}
          <div className="product-view-field full-width">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Ej. Buzo Oversize"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          {/* Precio y Stock */}
          <div className="product-view-field half-width">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              type="number"
              required
              min="0"
              placeholder="0"
              value={formData.precio}
              onChange={handleChange}
            />
          </div>

          <div className="product-view-field half-width">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              required
              min="0"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          {/* Categoría */}
          <div className="product-view-field full-width">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option value="Buzos">Buzos</option>
              <option value="Camperas">Camperas</option>
              <option value="Remeras">Remeras</option>
              <option value="Pantalones">Pantalones</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="product-view-field full-width">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="5"
              placeholder="Escribe la descripción del producto..."
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="product-view-actions">
          <button 
            type="button" 
            className="product-view-btn product-view-btn-secondary"
            onClick={() => navigate('/productos')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="product-view-btn product-view-btn-primary"
          >
            {esEdicion ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}