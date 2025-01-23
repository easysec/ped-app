import React from 'react';
import Login from '../components/Login';

function LoginPage({ setToken, setRole }) {  // Asegúrate de recibir setRole como prop
  return (
    <div>
      <Login setToken={setToken} setRole={setRole} />  {/* Pasar setRole al componente Login */}
    </div>
  );
}

export default LoginPage;
