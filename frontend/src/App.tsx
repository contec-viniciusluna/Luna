import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import ClientRegister from '@/pages/ClientRegister';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes/cadastros" element={<ClientRegister />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}