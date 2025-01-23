// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import SearchDrugs from './pages/SearchDrugs';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import './custom.scss';
import Learning from './pages/Learning'; // Importar el nuevo componente de aprendizaje
import AdminConsole from './pages/AdminConsole'; // Importar la consola de administración
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import RemindersPage from './pages/RemindersPage';
import ManageDrugs from './pages/ManageDrugs';
import { RemindersProvider } from './contexts/RemindersContext'; // Importar el contexto de recordatorios

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // Estado para almacenar el rol

  // Al cargar la aplicación, buscamos el token en el localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role'); // Guardar el rol
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedRole) {
      setRole(savedRole); // Guardar el rol en el estado
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Eliminar el rol al cerrar sesión
    setToken(null);
    setRole(null);
  };

  return (
    <RemindersProvider> {/* Envolver la aplicación en el contexto de recordatorios */}
      <Router>
        <Header token={token} role={role} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-profile"
            element={
              <PrivateRoute>
                <CreateProfile />
              </PrivateRoute>
            }
          />
          <Route path="/search-drugs" element={<SearchDrugs />} />
          <Route path="/learning" element={<Learning />} /> {/* Nueva ruta para la sección de aprendizaje */}
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/login"
            element={<LoginPage setToken={setToken} setRole={setRole} />}
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          {/* Nueva ruta para la página de recordatorios */}
          <Route
            path="/reminders"
            element={
              <PrivateRoute>
                <RemindersPage />
              </PrivateRoute>
            }
          />
          {/* Ruta protegida para el AdminConsole */}
          <Route
            path="/admin-console"
            element={
              <PrivateRoute>
                {role === 'admin' ? <AdminConsole /> : <Navigate to="/" />}
              </PrivateRoute>
            }
          />

<Route path="/manage-drugs" element={<PrivateRoute role="admin"><ManageDrugs /></PrivateRoute>} />

        </Routes>
      </Router>
    </RemindersProvider>
  );
}

export default App;
