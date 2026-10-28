export const SearchBar = ({ onSearch }) => (
  <div style={{ position: 'relative', marginBottom: '20px' }}>
    <input 
      type="text" 
      placeholder="🔍 Buscar por componente mecánico o código SKU patrimonial..." 
      onChange={(e) => onSearch(e.target.value)}
      style={{ 
        padding: '12px 16px', 
        width: '100%', 
        fontSize: '14px',
        borderRadius: '8px', 
        border: '1px solid #cbd5e1', 
        boxSizing: 'border-box',
        outline: 'none',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
        fontFamily: 'inherit'
      }}
    />
  </div>
);