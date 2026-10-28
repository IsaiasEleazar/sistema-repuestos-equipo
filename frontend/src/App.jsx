import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Listado } from './pages/Listado';
import { FormularioRepuesto } from './pages/FormularioRepuesto';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '30px 0' }}> 
        <Routes>
          <Route path="/" element={<Listado />} />
          <Route path="/nuevo" element={<FormularioRepuesto />} />
          <Route path="/repuesto/:id" element={<FormularioRepuesto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;