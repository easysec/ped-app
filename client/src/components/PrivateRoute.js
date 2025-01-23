// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // Verifica si el token está en localStorage
  return token ? children : <Navigate to="/login" />; // Redirige a la página de login si no hay token
}

export default PrivateRoute;
