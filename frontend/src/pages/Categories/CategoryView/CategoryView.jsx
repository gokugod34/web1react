import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryView.css';

const buildFormState = (category) => ({
  name: category?.name ?? '',
  description: category?.description ?? ''
});

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState(buildFormState());
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/categories/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo cargar la categoría');
        }

        const data = await response.json();
        setFormData(buildFormState(data));
      } catch (err) {
        setError(err.message || 'Error de red al cargar la categoría');
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      loadCategory();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setSubmitError('El nombre es requerido');
      return;
    }

    try {
      setSubmitError('');

      const url = isEditing ? `/api/categories/${id}/edit` : '/api/categories/new';
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          description: formData.description
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo guardar la categoría');
      }

      navigate('/categories');
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar la categoría');
    }
  };

  if (loading) {
    return <p className="categories-empty-msg">Cargando…</p>;
  }

  if (error) {
    return <p className="categories-empty-msg">{error}</p>;
  }

  return (
    <div className="category-view-container">
      <header className="category-view-header">
        <h1 className="category-view-title">
          {isEditing ? '✍🏻 Editar Categoría' : '➕ Nueva Categoría'}
        </h1>
        <button
          className="category-view-btn-back"
          type="button"
          onClick={() => navigate('/categories')}
        >
          Volver al listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="category-view-card">
        <div className="category-view-form-grid">
          {/* Nombre de la Categoría */}
          <div className="category-view-field full-width">
            <label htmlFor="name">Nombre de la Categoría</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ej. Camperas"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Descripción */}
          <div className="category-view-field full-width">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Escribe la descripción de la categoría..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {submitError ? <p className="category-view-error">{submitError}</p> : null}

        {/* Acciones */}
        <div className="category-view-actions">
          <button
            type="button"
            className="category-view-btn category-view-btn-secondary"
            onClick={() => navigate('/categories')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="category-view-btn category-view-btn-primary"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}
