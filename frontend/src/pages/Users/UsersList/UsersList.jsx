import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsersList.css';

export default function UsersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: "Admin Principal", email: "admin@vimet.com", role: "Administrador", status: "Activo" },
    { id: 2, name: "Juan Pérez", email: "juan@vimet.com", role: "Usuario", status: "Activo" },
    { id: 3, name: "María López", email: "maria@vimet.com", role: "Usuario", status: "Inactivo" }
  ]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? (Simulación)')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <section className="users-page">
      <header className="users-header">
        <h1 className="users-title">👥 Usuarios</h1>

        <div className="users-toolbar">
          <input
            className="users-search"
            type="search"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar usuario"
          />

          <button
            className="users-add-button"
            type="button"
            onClick={() => navigate('/usuarios/nuevo')}
          >
            ➕ Nuevo Usuario
          </button>
        </div>
      </header>

      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <p className="users-empty-msg">No se encontraron usuarios.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-id">#{user.id}</td>
                  <td 
                    className="user-name-cell"
                    onClick={() => navigate(`/usuarios/${user.id}`)}
                  >
                    {user.name}
                  </td>
                  <td className="user-email-cell">{user.email}</td>
                  <td>
                    <span className={`user-role-tag ${user.role === 'Administrador' ? 'role-admin' : 'role-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/usuarios/editar/${user.id}`)}
                    >
                      ✍🏻 Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(user.id)}
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
    </section>
  );
}
