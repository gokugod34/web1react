import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserView.css';

const buildFormState = (user) => ({
  name: user?.name ?? '',
  email: user?.email ?? ''
});

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState(buildFormState());
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo cargar el usuario');
        }

        const data = await response.json();
        setFormData(buildFormState(data));
      } catch (err) {
        setError(err.message || 'Error de red al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      loadUser();
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
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setSubmitError('El nombre es requerido');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmitError('El email es requerido y debe tener un formato válido');
      return;
    }

    try {
      setSubmitError('');

      const url = isEditing ? `/api/users/${id}/edit` : '/api/users/new';
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo guardar el usuario');
      }

      navigate('/users');
    } catch (err) {
      setSubmitError(err.message || 'No se pudo guardar el usuario');
    }
  };

  if (loading) {
    return <p className="users-empty-msg">Cargando…</p>;
  }

  if (error) {
    return <p className="users-empty-msg">{error}</p>;
  }

  return (
    <div className="user-view-container">
      <header className="user-view-header">
        <h1 className="user-view-title">
          {isEditing ? '✍🏻 Editar Usuario' : '➕ Nuevo Usuario'}
        </h1>
        <button
          className="user-view-btn-back"
          type="button"
          onClick={() => navigate('/users')}
        >
          Volver al listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="user-view-card">
        <div className="user-view-form-grid">
          {/* Nombre */}
          <div className="user-view-field full-width">
            <label htmlFor="name">Nombre Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ej. Juan Pérez"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="user-view-field full-width">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@vimet.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {submitError ? <p className="user-view-error">{submitError}</p> : null}

        {/* Acciones */}
        <div className="user-view-actions">
          <button
            type="button"
            className="user-view-btn user-view-btn-secondary"
            onClick={() => navigate('/users')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="user-view-btn user-view-btn-primary"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}
