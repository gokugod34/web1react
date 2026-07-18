import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesList.css';

export default function CategoriesList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de categorías');
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error de red al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.description ?? '').toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}/delete`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'No se pudo eliminar la categoría');
      }

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la categoría');
    }
  };

  return (
    <section className="categories-page">
      <header className="categories-header">
        <h1 className="categories-title">🏪 Categorías</h1>

        <div className="categories-toolbar">
          <input
            className="categories-search"
            type="search"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar categoría"
          />

          <button
            className="categories-add-button"
            type="button"
            onClick={() => navigate('/categories/new')}
          >
            ➕ Nueva Categoría
          </button>
        </div>
      </header>

      <div className="categories-table-container">
        {loading ? (
          <p className="categories-empty-msg">Cargando…</p>
        ) : error ? (
          <p className="categories-empty-msg">{error}</p>
        ) : filteredCategories.length === 0 ? (
          <p className="categories-empty-msg">No se encontraron categorías.</p>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="category-id">#{category.id}</td>
                  <td
                    className="category-name-cell"
                    onClick={() => navigate(`/categories/${category.id}/edit`)}
                  >
                    {category.name}
                  </td>
                  <td className="category-description-cell">{category.description}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/categories/${category.id}/edit`)}
                    >
                      ✍🏻 Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(category.id)}
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
