export const StockBadge = ({ actual, minimo }) => {
  const bajoStock = actual <= minimo;
  
  const badgeStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: bajoStock ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.15)',
    color: bajoStock ? '#f87171' : '#22d3ee',
    border: bajoStock ? '1px solid #ef4444' : '1px solid #06b6d4',
    boxShadow: bajoStock ? '0 0 10px rgba(239, 64, 64, 0.2)' : '0 0 10px rgba(6, 182, 212, 0.2)'
  };

  return (
    <span style={badgeStyle}>
      <span style={{ 
        width: '6px', height: '6px', borderRadius: '50%', 
        background: bajoStock ? '#ef4444' : '#06b6d4',
        boxShadow: bajoStock ? '0 0 8px #ef4444' : '0 0 8px #06b6d4'
      }}></span>
      {bajoStock ? 'LOW STOCK:' : 'IN STOCK:'} {actual} u.
    </span>
  );
};