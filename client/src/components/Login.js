import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import loginPic from '../assets/images/login.png'; 

function Login({ setToken, setRole }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate(); // Usar useNavigate para redirigir

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, form);

      if (response.status === 200) {
        const { data } = response;
        localStorage.setItem('token', data.token); // Guardar token en localStorage
        localStorage.setItem('role', data.role); // Guardar el rol en localStorage
        setToken(data.token); // Actualizar el estado del token en el componente padre
        setRole(data.role); // Guardar el rol en el estado
        navigate('/profile'); // Redirigir al perfil después del inicio de sesión
        alert('Inicio de sesión exitoso');
      } else {
        alert('Error al iniciar sesión: Respuesta inesperada del servidor');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Ocurrió un error al iniciar sesión'}`);
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        alert('Error en la solicitud. No se recibió respuesta del servidor');
      } else {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h3 className="text-center text-primary mb-4">Iniciar Sesión</h3>

              {/* Imagen o Ícono Representativo */}
              <div className="text-center mb-4">
                <Image
                  src={loginPic}
                  roundedCircle
                  alt="Inicio de Sesión"
                  width="100"
                  height="100"
                  className="mb-3"
                />
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre de usuario"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                >
                  Iniciar Sesión
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
