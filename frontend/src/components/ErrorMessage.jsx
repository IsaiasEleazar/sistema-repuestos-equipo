export const ErrorMessage = ({ message }) => (
  <div style={{ 
    padding: '16px', 
    background: 'rgba(239, 68, 68, 0.1)', 
    color: '#f87171', 
    border: '1px solid #ef4444', 
    borderRadius: '8px', 
    margin: '20px 0', 
    fontSize: '13px', 
    fontFamily: "var(--sans)",
    boxShadow: '0 0 15px rgba(239, 64, 64, 0.15)'
  }}>
    <strong>🚨 CORE_ANOMALY_DETECTED //</strong> {message || 'Falla imprevista en el enlace de datos.'}
  </div>
);