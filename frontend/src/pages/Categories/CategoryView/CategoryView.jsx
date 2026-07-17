import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryView.css';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (esEdicion) {
      // Simular carga de datos de la categoría
      const timer = setTimeout(() => {
        setFormData({
          nombre: 'Ropa',
          descripcion: 'Indumentaria general de Vimet, incluyendo buzos, camperas, remeras y pantalones de algodón.'
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de la categoría a guardar:', formData);
    alert(`¡Categoría guardada! (${esEdicion ? 'Edición de Categoría' : 'Nueva Categoría'}) - Mira la consola.`);
    navigate('/categorias');
  };

  return (
    <div className="category-view-container">
      <header className="category-view-header">
        <h1 className="category-view-title">
          {esEdicion ? '✍🏻 Editar Categoría' : '➕ Nueva Categoría'}
        </h1>
        <button 
          className="category-view-btn-back" 
          type="button" 
          onClick={() => navigate('/categorias')}
        >
          Volver al listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="category-view-card">
        <div className="category-view-form-grid">
          {/* Nombre de la Categoría */}
          <div className="category-view-field full-width">
            <label htmlFor="nombre">Nombre de la Categoría</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Ej. Camperas"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          {/* Descripción */}
          <div className="category-view-field full-width">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              placeholder="Escribe la descripción de la categoría..."
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="category-view-actions">
          <button 
            type="button" 
            className="category-view-btn category-view-btn-secondary"
            onClick={() => navigate('/categorias')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="category-view-btn category-view-btn-primary"
          >
            {esEdicion ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}
