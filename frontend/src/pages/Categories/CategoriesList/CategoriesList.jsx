import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesList.css';

export default function CategoriesList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([
    { id: 1, name: "Ropa", description: "Indumentaria general, hoodies, pantalones y remeras.", totalProducts: 14 },
    { id: 2, name: "Accesorios", description: "Gorras, mochilas, cinturones y otros complementos.", totalProducts: 8 },
    { id: 3, name: "Calzado", description: "Zapatillas deportivas, urbanas y botas de cuero.", totalProducts: 5 }
  ]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? (Simulación)')) {
      setCategories(prev => prev.filter(c => c.id !== id));
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
            onClick={() => navigate('/categorias/nueva')}
          >
            ➕ Nueva Categoría
          </button>
        </div>
      </header>

      <div className="categories-table-container">
        {filteredCategories.length === 0 ? (
          <p className="categories-empty-msg">No se encontraron categorías.</p>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Artículos Vinculados</th>
                <th className="actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="category-id">#{category.id}</td>
                  <td 
                    className="category-name-cell"
                    onClick={() => navigate(`/categorias/${category.id}`)}
                  >
                    {category.name}
                  </td>
                  <td className="category-description-cell">{category.description}</td>
                  <td className="category-products-cell">
                    {category.totalProducts} artículos
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/categorias/editar/${category.id}`)}
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