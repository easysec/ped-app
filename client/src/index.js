import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';  // Importar createRoot desde 'react-dom/client'
import './custom.scss';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Crear el root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
