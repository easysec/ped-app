import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('${process.env.REACT_APP_BACKEND_URL}/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil', error);
      });
  }, []);

  return (
    <div>
      {profile ? <h1>Bienvenido {profile.username}</h1> : <p>Cargando...</p>}
    </div>
  );
}

export default Profile;