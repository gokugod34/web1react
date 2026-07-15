import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [productsCount, setProductsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Placeholder temporal para sesión real futura.
    // const currentUser = sessionStorage.getItem('currentUser');
    const currentUser = 'Usuario';

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                const products = await productsResponse.json();
                const categories = await categoriesResponse.json();

                if (isMounted) {
                    setProductsCount(Array.isArray(products) ? products.length : 0);
                    setCategoriesCount(Array.isArray(categories) ? categories.length : 0);
                }
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);

                if (isMounted) {
                    setProductsCount(0);
                    setCategoriesCount(0);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="home-dashboard">
            <header className="home-header">
                <div>
                    <p className="home-eyebrow">Panel principal</p>
                    <h1 className="home-title">¡Hola {currentUser}!</h1>
                </div>
            </header>

            {loading ? (
                <p className="home-loading">Cargando…</p>
            ) : (
                <div className="dashboard-grid">
                    <article className="summary-card">
                        <div className="summary-card__content">
                            <p className="summary-label">Productos</p>
                            <h2 className="summary-value">{productsCount}</h2>
                            <div className="summary-actions">
                                <Link className="summary-button" to="/products">Ver Listado</Link>
                                <Link className="summary-button" to="/products/new">Agregar Producto</Link>
                            </div>
                        </div>
                    </article>

                    <article className="summary-card">
                        <div className="summary-card__content">
                            <p className="summary-label">Categorías</p>
                            <h2 className="summary-value">{categoriesCount}</h2>
                            <div className="summary-actions">
                                <Link className="summary-button" to="/categories">Ver Listado</Link>
                                <Link className="summary-button" to="/categories/new">Agregar Categoría</Link>
                            </div>
                        </div>
                    </article>
                </div>
            )}
        </section>
    );
};

export default Home;