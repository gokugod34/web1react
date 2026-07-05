
export default function CategoriesList() {
  const categoriasMock = [
    { id: 1, nombre: "Hoodies", totalProductos: 14 },
    { id: 2, nombre: "Pantalones", totalProductos: 8 },
    { id: 3, nombre: "Remeras", totalProductos: 22 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>🏪 Módulo de Categorías</h2>
        <button style={{ background: 'black', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '4px', fontFamily: 'var(--fuente-primaria)', letterSpacing: '1px', cursor: 'pointer' }}>
          ➕ Nueva Categoría
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Nombre de Categoría</th>
              <th style={{ padding: '1rem' }}>Productos Vinculados</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasMock.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>{cat.id}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{cat.nombre}</td>
                <td style={{ padding: '1rem' }}>{cat.totalProductos} artículos</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ background: '#e2e8f0', color: '#1e293b', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✍🏻 Editar</button>
                  <button style={{ background: '#fee2e2', color: '#ef4444', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}