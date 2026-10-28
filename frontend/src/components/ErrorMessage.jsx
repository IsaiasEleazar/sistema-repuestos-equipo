export const ErrorMessage = ({ message }) => (
  <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '5px', margin: '10px 0' }}>
    <strong>Error:</strong> {message || 'Falla de comunicación con el servidor.'}
  </div>
);
