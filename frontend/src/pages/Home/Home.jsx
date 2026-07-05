
import React from 'react';

const Home = () => {
    return (
        <div className="home-dashboard">
            <h2 style={{ fontFamily: 'var(--fuente-primaria)', fontSize: '2.5rem', letterSpacing: '2px' }}>
                Resumen de Vimet
            </h2>
            <hr style={{ marginBottom: '2rem', borderColor: 'var(--turquesa)' }} />

            {/* Tarjetas de Métricas Falsas (Dummy Data) */}
            <div className="dashboard-cards">
                <div className="stat-card">
                    <h3>Ventas del Mes</h3>
                    <p className="stat-value">$ 450.000</p>
                    <span className="stat-badge success">+15% vs mes anterior</span>
                </div>
                <div className="stat-card">
                    <h3>Pedidos Activos</h3>
                    <p className="stat-value">24</p>
                    <span className="stat-badge neutral">Listos para despachar</span>
                </div>
                <div className="stat-card">
                    <h3>Alertas de Stock</h3>
                    <p className="stat-value alerta">3</p>
                    <span className="stat-badge danger">Prendas por agotarse</span>
                </div>
            </div>

            {/* Tabla de Últimos Movimientos Falsos */}
            <div className="recent-orders">
                <h3 style={{ fontFamily: 'var(--fuente-primaria)', fontSize: '1.8rem', marginBottom: '1rem' }}>
                    Últimos Pedidos (Datos de Prueba)
                </h3>
                <div className="table-container">
                    <table className="dummy-table">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#VIM-00101</td>
                                <td>Martina Moneo</td>
                                <td>02/07/2026</td>
                                <td>$ 35.000</td>
                                <td><span className="status pending">Pendiente</span></td>
                            </tr>
                            <tr>
                                <td>#VIM-00100</td>
                                <td>Marcos Gonzales</td>
                                <td>01/07/2026</td>
                                <td>$ 12.000</td>
                                <td><span className="status completed">Enviado</span></td>
                            </tr>
                            <tr>
                                <td>#VIM-00099</td>
                                <td>Conrado Sánchez</td>
                                <td>28/06/2026</td>
                                <td>$ 25.000</td>
                                <td><span className="status completed">Enviado</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;