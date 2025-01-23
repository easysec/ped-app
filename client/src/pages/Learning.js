import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Modal } from 'react-bootstrap';

function Learning() {
  const articles = [
    {
      id: 1,
      title: 'La importancia de conocer las dosis pediátricas',
      description: 'Aprenda por qué es crucial administrar las dosis correctas en medicamentos pediátricos.',
      content: 'La administración de dosis incorrectas en pediatría puede ocasionar efectos adversos graves debido a la sensibilidad de los niños a ciertos medicamentos. Este artículo analiza las pautas y recomendaciones para evitar errores comunes.',
    },
    {
      id: 2,
      title: 'Prevención de interacciones medicamentosas en niños',
      description: 'Conozca cómo identificar y prevenir interacciones medicamentosas comunes en pediatría.',
      content: 'Las interacciones medicamentosas en pediatría son un problema crítico que puede afectar la efectividad del tratamiento. Este artículo revisa casos frecuentes y cómo los médicos pueden evitarlos.',
    },
    {
      id: 3,
      title: 'Cuidados durante enfermedades respiratorias en niños',
      description: 'Consejos y mejores prácticas para cuidar a niños durante enfermedades respiratorias.',
      content: 'Las infecciones respiratorias en niños son comunes y requieren atención adecuada. Este artículo proporciona estrategias para el manejo en casa y cuándo es necesario buscar atención médica.',
    },
    {
      id: 4,
      title: 'MHealth en pediatría: Herramientas digitales para padres',
      description: 'Explora cómo las herramientas de salud móvil están transformando el cuidado infantil.',
      content: 'Las aplicaciones móviles de salud (mHealth) están revolucionando la manera en que los padres gestionan el cuidado de sus hijos. Aprende cómo estas herramientas pueden ayudarte a mantener un registro de medicamentos y citas médicas.',
    },
    {
      id: 5,
      title: 'Riesgos comunes en la dosificación de medicamentos',
      description: 'Identifique los riesgos frecuentes al administrar medicamentos a los niños.',
      content: 'Los errores de dosificación en pediatría son una de las principales causas de hospitalización. Este artículo detalla cómo prevenir errores y garantizar la seguridad del paciente.',
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleShowDetails = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

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
                  className="mt-3"
                  onClick={() => handleShowDetails(article)}
                >
                  Leer más
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para mostrar detalles */}
      <Modal show={!!selectedArticle} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticle?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedArticle?.content}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Learning;
