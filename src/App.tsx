// src/App.tsx
import React, { useEffect } from 'react';
// Importamos 'useLocation' para el scroll y lo demás para las rutas
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Importamos nuestros componentes
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { StatsPage } from './pages/StatsPage';

// La URL base de la API
export const API_BASE_URL = 'https://tralalero-api.vercel.app/api';

//Componente para Arreglar el Scroll
// Reemplazo al <ScrollRestoration> que daba me error
const ScrollToTop: React.FC = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

//Layout Principal
const AppLayout: React.FC = () => {
  return (
    <div style={{ paddingTop: '70px' }}> 
      <AppNavbar />
      <Container className="py-4">
        <ScrollToTop /> 
        <Outlet />
      </Container>
    </div>
  );
};

//Componente APP
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>

        <Route index={true} element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/character/:id" element={<DetailPage />} />

      </Route>
    </Routes>
  );
};

export default App;