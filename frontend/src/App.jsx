import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import './App.css'; // Importamos la estructura de la US#3

// Componentes Dummys para las rutas
const ProductsList = () => <div><h2>📦 Lista de Productos</h2><p>Tabla de productos.</p></div>;
const ProductView = () => <div><h2>👁️ Detalle del Producto</h2></div>;
const ProductNew = () => <div><h2>➕ Agregar Nuevo Producto</h2></div>;
const CategoriesList = () => <div><h2>🏪 Categorías</h2></div>;
const CategoryNew = () => <div><h2>➕ Agregar Nueva Categoría</h2></div>;
const UsersList = () => <div><h2>👥 Usuarios</h2></div>;
const Profile = () => <div><h2>👤 Mi Perfil</h2></div>;
const Error404 = () => <div><h2>❌ Error 404 - Página no encontrada</h2></div>;

function App() {
  // Estado para controlar si el Sidebar está abierto o cerrado en móviles (US#3)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace (útil en móviles)
  const closeMenu = () => setIsSidebarOpen(false);

  return (
    <BrowserRouter>
      <div className="dashboard-layout">
        
        {/* === SIDEBAR === */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Vimet Admin</h2>
            {/* Botón para cerrar (solo visible en <= 1024px) */}
            <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
              ✖
            </button>
          </div>
          
          <nav>
            <ul>
              <li><Link to="/" onClick={closeMenu}>🏠 Inicio</Link></li>
              <li><Link to="/products" onClick={closeMenu}>📦 Productos</Link></li>
              <li><Link to="/categories" onClick={closeMenu}>🏪 Categorías</Link></li>
              <li><Link to="/users" onClick={closeMenu}>👥 Usuarios</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>👤 Perfil</Link></li>
            </ul>
          </nav>
        </aside>

        {/* === MAIN AREA === */}
        <main className="main-area">
          {/* Botón Hamburguesa para abrir el menú (solo visible en <= 1024px) */}
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
            ☰ Menú
          </button>

          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/new" element={<ProductNew />} />
              <Route path="/products/:id" element={<ProductView />} />
              <Route path="/categories" element={<CategoriesList />} />
              <Route path="/categories/new" element={<CategoryNew />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;