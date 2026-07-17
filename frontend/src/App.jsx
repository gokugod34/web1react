import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import ProductsList from './pages/Products/ProductsList/ProductsList.jsx';
import ProductView from './pages/Products/ProductView/ProductView.jsx';
import CategoriesList from './pages/Categories/CategoriesList/CategoriesList.jsx';
import CategoryView from './pages/Categories/CategoryView/CategoryView.jsx';
import UsersList from './pages/Users/UsersList/UsersList.jsx';
import UserView from './pages/Users/UserView/UserView.jsx';
import Sidebar from './components/Sidebar.jsx';
import './App.css'; // Importamos la estructura de la US#3

// Componentes Dummys para las rutas restantes
const Profile = () => <div><h2>👤 Mi Perfil</h2></div>;
const Error404 = () => <div><h2>❌ Error 404 - Página no encontrada</h2></div>;

function App() {
  // Estado para controlar si el Sidebar está abierto o cerrado en móviles (US#3)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* === SIDEBAR === */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* === MAIN AREA === */}
        <main className="main-area">
          <header className="main-header">
            {/* Botón Hamburguesa para abrir el menú (solo visible en <= 1024px) */}
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              ☰ Menú
            </button>
            <div className="header-brand" style={{ fontFamily: 'var(--fuente-primaria)', fontSize: '1.8rem', letterSpacing: '1px' }}>
              ADMINISTRACIÓN
            </div>
            <div className="header-user" style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--gris-oscuro)' }}>
              👤 Admin
            </div>
          </header>

          <section className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Módulo: Productos */}
              <Route path="/productos" element={<ProductsList />} />
              <Route path="/productos/nuevo" element={<ProductView />} />
              <Route path="/productos/:id" element={<ProductView />} />
              <Route path="/productos/editar/:id" element={<ProductView />} />

              {/* Módulo: Categorías */}
              <Route path="/categorias" element={<CategoriesList />} />
              <Route path="/categorias/nueva" element={<CategoryView />} />
              <Route path="/categorias/:id" element={<CategoryView />} />
              <Route path="/categorias/editar/:id" element={<CategoryView />} />

              {/* Módulo: Usuarios */}
              <Route path="/usuarios" element={<UsersList />} />
              <Route path="/usuarios/nuevo" element={<UserView />} />
              <Route path="/usuarios/:id" element={<UserView />} />
              <Route path="/usuarios/editar/:id" element={<UserView />} />

              {/* Otros */}
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </section>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;