import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, setIsOpen }) {
  const closeMenu = () => setIsOpen(false);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <h2>Vimet</h2>
        {/* Botón para cerrar (solo visible en <= 1024px) */}
        <button 
          className="close-sidebar" 
          onClick={closeMenu} 
          aria-label="Cerrar menú"
        >
          ✖
        </button>
      </div>
      
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              🏠 Inicio
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/productos" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              📦 Productos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/categorias" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              🏪 Categorías
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/usuarios" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              👥 Usuarios
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              👤 Perfil
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
