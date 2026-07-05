import { useParams } from 'react-router-dom';

export default function ProductView() {
  // Extraemos el parámetro de la URL (si es /products/5, id será 5)
  const { id } = useParams(); 

  return (
    <div>
      <h1>{id ? `👁️ Detalle del Producto #${id}` : '➕ Nuevo Producto'}</h1>
      <p>Aquí irá el formulario de edición o creación.</p>
    </div>
  );
}