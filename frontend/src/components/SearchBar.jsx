export const SearchBar = ({ onSearch }) => (
  <input type="text" placeholder="🔍 Buscar por nombre o SKU..." 
    onChange={(e) => onSearch(e.target.value)}
    style={{ padding: '8px', width: '100%', marginBottom: '15px', boxSizing: 'border-box' }}
  />
);
