import { useEffect, useState } from 'react';
import { fetchRepuestos, deleteRepuesto } from '../services/api';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { StockBadge } from '../components/StockBadge';
import { ErrorMessage } from '../components/ErrorMessage';

export const Listado = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await fetchRepuestos(search);
      setRepuestos(res.data);
    } catch (err) { setError('Error de conexión con el backend.'); }
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que desea eliminar este repuesto?')) {
      try {
        await deleteRepuesto(id);
        load();
      } catch (err) { setError('No se pudo eliminar el elemento.'); }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventario de Repuestos</h2>
      {error && <ErrorMessage message={error} />}
      <SearchBar onSearch={setSearch} />
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>SKU / Código</th><th>Nombre</th><th>Categoría</th><th>Ubicación</th><th>Stock</th><th>Precio</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestos.map(r => (
            <tr key={r.id}>
              <td>{r.codigo}</td>
              <td>{r.nombre}</td>
              <td>{r.categoria_nombre || 'Sin categoría'}</td>
              <td>{r.ubicacion || 'N/A'}</td>
              <td><StockBadge actual={r.stock_actual} minimo={r.stock_minimo} /></td>
              <td>S/. {r.precio.toFixed(2)}</td>
              <td>
                <Link to={`/repuesto/${r.id}`}>✏️ Editar</Link> | 
                <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}> 🗑️ Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
