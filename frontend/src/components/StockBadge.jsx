export const StockBadge = ({ actual, minimo }) => {
  const bajoStock = actual <= minimo;
  return (
    <span style={{ 
      padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold',
      background: bajoStock ? '#ffcccc' : '#ccffcc', color: bajoStock ? '#cc0000' : '#006600'
    }}>
      {actual} (Mín: {minimo}) {bajoStock && '⚠️ REORDENAR'}
    </span>
  );
};
