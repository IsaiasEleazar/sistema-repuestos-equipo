import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const isSelected = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isSelected(path) ? '#ffffff' : '#94a3b8',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '10px 20px',
    borderRadius: '6px',
    background: isSelected(path) ? 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)' : 'transparent',
    boxShadow: isSelected(path) ? '0 4px 15px rgba(6, 182, 212, 0.3)' : 'none',
    transition: 'all 0.3s ease'
  });

  return (
    <nav style={{ 
      margin: 0, padding: '0 40px', height: '70px',
      background: '#131c2e', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid #1e293b',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)', padding: '8px', borderRadius: '8px', boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
          <span style={{ fontSize: '18px', color: '#fff' }}>🛡️</span>
        </div>
        <h3 style={{ margin: 0, color: '#ffffff', fontWeight: '800', fontSize: '16px', letterSpacing: '1px' }}>
          CORE INVENTORY <span style={{ fontWeight: '300', fontSize: '12px', color: '#06b6d4' }}>// MAESTRANZA v2.5</span>
        </h3>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/" style={linkStyle('/')}>📊 DATAVIEW GENERAL</Link>
        <Link to="/nuevo" style={linkStyle('/nuevo')}>➕ QUICK ADD</Link>
      </div>
    </nav>
  );
};