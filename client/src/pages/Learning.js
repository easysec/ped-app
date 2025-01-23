import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';

function Learning() {
  const articles = [
    {
      id: 1,
      title: 'La importancia de conocer las dosis pediátricas',
      description: 'Aprenda por qué es crucial administrar las dosis correctas en medicamentos pediátricos.',
      link: '#',
    },
    {
      id: 2,
      title: 'Prevención de interacciones medicamentosas en niños',
      description: 'Conozca cómo identificar y prevenir interacciones medicamentosas comunes en pediatría.',
      link: '#',
    },
    {
      id: 3,
      title: 'Cuidados durante enfermedades respiratorias en niños',
      description: 'Consejos y mejores prácticas para cuidar a niños durante enfermedades respiratorias.',
      link: '#',
    },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-5 text-center text-primary">Artículos de Aprendizaje</h2>
      <Row>
        {articles.map((article) => (
          <Col md={4} key={article.id} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="text-primary">{article.title}</Card.Title>
                  <Card.Text className="text-muted">{article.description}</Card.Text>
                </div>
                <Button
                  variant="outline-primary"
                  href={article.link}
                  target="_blank"
                  className="mt-3"
                >
                  Leer más
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Learning;
