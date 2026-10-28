import { Link } from 'react-router-dom';
export const Navbar = () => (
  <nav style={{ padding: '1rem', background: '#005ea6', color: '#fff', display: 'flex', gap: '15px' }}>
    <h3 style={{ margin: 0 }}>SENATI - Repuestos</h3>
    <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Listado</Link>
    <Link to="/nuevo" style={{ color: '#fff', textDecoration: 'none' }}>Nuevo Repuesto</Link>
  </nav>
);
