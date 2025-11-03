// src/App.tsx
import React from 'react';
// Importamos los componentes de React Router para las rutas
import { Routes, Route, Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Importamos nuestra Navbar (la acabamos de crear)
import { AppNavbar } from './components/Navbar';

// Importamos las páginas que VAMOS a crear
// (No te preocupes si VS Code da error, en los siguientes pasos las creamos)
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { StatsPage } from './pages/StatsPage';

export const API_BASE_URL = 'https://tralalero-api.vercel.app/api';

//Layout Principal
const AppLayout: React.FC = () => {
  return (
    <div className="pt-5" style={{paddingTop: '56px'}}> 
      <AppNavbar />
      <Container className="py-4">
        <Outlet />
      </Container>
      <ScrollRestoration />
    </div>
  );
};

//Componente App
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