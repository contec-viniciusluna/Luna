import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import CadastroCliente from '@/pages/CadastroCliente';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes/cadastros" element={<CadastroCliente />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}