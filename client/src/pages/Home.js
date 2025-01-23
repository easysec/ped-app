import React from 'react';
import { Button, Container, Card, Row, Col, Image } from 'react-bootstrap';
import profilePic from '../assets/images/profilejm.jpg'; // Importing the profile picture

function Home({ token = null }) {
  return (
    <Container className="mt-5">
      {/* About Me Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4} className="text-center mb-3 mb-md-0">
              <Image
                src={profilePic} // Replace this with your photo URL
                roundedCircle
                width="150"
                height="150"
                className="shadow-sm"
              />
            </Col>
            <Col md={8}>
              <h2 className="text-primary">Maria Martinez</h2>
              <p className="text-muted">
                ¡Hola! Mi nombre es <strong>Maria Martinez</strong>, y esta aplicación es parte de mi tesis para obtener mi <strong>Licenciatura en Farmacia</strong>. 
                Mi objetivo es brindar una herramienta confiable que facilite el cálculo de dosis pediátricas y la prevención de interacciones medicamentosas.
              </p>
              <Button
                variant="outline-primary"
                href="https://www.linkedin.com/in/mjacquelinema/" // Replace with your LinkedIn or portfolio link
                target="_blank"
              >
                Conóceme más
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Welcome Section */}
      <Card className="text-center shadow-sm border-0">
        <Card.Body>
          <Card.Title className="text-primary" style={{ fontSize: '2rem' }}>
            Bienvenido a Pediatric Meds
          </Card.Title>
          <Card.Text className="text-muted">
            Esta aplicación está diseñada para ayudarte a encontrar dosis recomendadas y verificar interacciones de medicamentos para niños. 
          </Card.Text>
          {/* Condición para mostrar el botón "Regístrate" */}
          {!token && (
            <Button variant="primary" href="/register">
              ¡Regístrate!
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Home;