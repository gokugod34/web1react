import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsersList.css';

export default function UsersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de usuarios');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error de red al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}/delete`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo eliminar el usuario');
      }

      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el usuario');
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
            onClick={() => navigate('/users/new')}
          >
            ➕ Nuevo Usuario
          </button>
        </div>
      </header>

      <div className="users-table-container">
        {loading ? (
          <p className="users-empty-msg">Cargando…</p>
        ) : error ? (
          <p className="users-empty-msg">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="users-empty-msg">No se encontraron usuarios.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th className="actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-id">#{user.id}</td>
                  <td
                    className="user-name-cell"
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                  >
                    {user.name}
                  </td>
                  <td className="user-email-cell">{user.email}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
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
