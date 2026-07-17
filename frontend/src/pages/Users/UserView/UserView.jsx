import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UserView.css';

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    estado: ''
  });

  useEffect(() => {
    if (esEdicion) {
      // Simular carga de datos del usuario
      const timer = setTimeout(() => {
        setFormData({
          nombre: 'Admin Principal',
          email: 'admin@vimet.com',
          rol: 'Administrador',
          estado: 'Activo'
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFormData({
        nombre: '',
        email: '',
        rol: '',
        estado: ''
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
    console.log('Datos del usuario a guardar:', formData);
    alert(`¡Usuario guardado! (${esEdicion ? 'Edición de Usuario' : 'Nuevo Usuario'}) - Mira la consola.`);
    navigate('/usuarios');
  };

  return (
    <div className="user-view-container">
      <header className="user-view-header">
        <h1 className="user-view-title">
          {esEdicion ? '✍🏻 Editar Usuario' : '➕ Nuevo Usuario'}
        </h1>
        <button 
          className="user-view-btn-back" 
          type="button" 
          onClick={() => navigate('/usuarios')}
        >
          Volver al listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="user-view-card">
        <div className="user-view-form-grid">
          {/* Nombre */}
          <div className="user-view-field full-width">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={formData.nombre}
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
              required
              placeholder="usuario@vimet.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Rol y Estado en la misma fila (desktop) */}
          <div className="user-view-field half-width">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="rol"
              required
              value={formData.rol}
              onChange={handleChange}
            >
              <option value="" disabled>Selecciona un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>

          <div className="user-view-field half-width">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              required
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="" disabled>Selecciona un estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Acciones */}
        <div className="user-view-actions">
          <button 
            type="button" 
            className="user-view-btn user-view-btn-secondary"
            onClick={() => navigate('/usuarios')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="user-view-btn user-view-btn-primary"
          >
            {esEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}
