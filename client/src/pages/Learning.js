import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Modal } from 'react-bootstrap';

function Learning() {
  const articles = [
    {
      id: 1,
      title: 'La importancia de las dosis correctas en medicamentos pediátricos',
      description:
        'Descubre por qué es crucial administrar las dosis adecuadas a los niños y cómo evitar errores comunes.',
      contentPage: '/articles/article1.html', // Ruta del archivo HTML del artículo 1
    },
    {
      id: 2,
      title: 'Seguridad en la administración de medicamentos a los niños',
      description:
        'Aprenda consejos clave para administrar medicamentos a los niños de manera segura y eficaz.',
      contentPage: '/articles/article2.html', // Ruta del archivo HTML del artículo 2
    },
    {
      id: 3,
      title: 'Cuidados en el hogar para enfermedades respiratorias en niños',
      description:
        'Guía para prevenir complicaciones y cuidar a los niños con infecciones respiratorias agudas en casa.',
      contentPage: '/articles/article3.html', // Ruta del archivo HTML del artículo 3
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

      {/* Modal para mostrar detalles del artículo */}
      <Modal
        show={!!selectedArticle}
        onHide={handleCloseModal}
        centered
        size="xl" // Tamaño del modal (extra-large)
        dialogClassName="responsive-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticle?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArticle && (
            <iframe
              src={selectedArticle.contentPage}
              style={{
                width: '100%',
                height: '70vh', // Ajustar la altura al 70% del viewport
                border: 'none',
              }}
              title={selectedArticle.title}
            ></iframe>
          )}
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
