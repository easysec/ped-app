import React, { useState } from 'react';
import { Form, Button, Container, ListGroup, Alert, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

function DrugSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null); // Medicamento seleccionado para mostrar en el modal
  const [interacciones, setInteracciones] = useState([]); // Lista de interacciones detectadas

  // Manejar búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/medicamentos?search=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error al buscar medicamentos:', error);
      alert('Error al buscar medicamentos');
    }
  };

  // Manejar selección y deselección de medicamentos
  const handleSelect = (med) => {
    let updatedSelectedMeds;

    if (selectedMeds.some((selected) => selected._id === med._id)) {
      updatedSelectedMeds = selectedMeds.filter((selected) => selected._id !== med._id);
    } else {
      updatedSelectedMeds = [...selectedMeds, med];
    }

    setSelectedMeds(updatedSelectedMeds);
    detectInteractions(updatedSelectedMeds); // Actualizar interacciones
  };

  // Detectar interacciones entre los medicamentos seleccionados
  const detectInteractions = (meds) => {
    const detectedInteractions = [];

    meds.forEach((med) => {
      if (med.interacciones) {
        med.interacciones.forEach((interaccion) => {
          const interactingMed = meds.find(
            (m) => m.nombre.toLowerCase() === interaccion.toLowerCase()
          );
          if (interactingMed) {
            const interactionText = `${med.nombre} y ${interactingMed.nombre}`;
            if (!detectedInteractions.includes(interactionText)) {
              detectedInteractions.push(interactionText); // Evitar duplicados
            }
          }
        });
      }
    });

    setInteracciones(detectedInteractions);
  };

  // Mostrar información detallada del medicamento en el modal
  const handleShowDetails = (med) => {
    setSelectedDrug(med);
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDrug(null);
  };

  const clearSelections = () => {
    setSelectedMeds([]);
    setInteracciones([]); // Limpiar interacciones
  };

  return (
    <Container className="mt-5">
      {/* Title Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h2 className="text-primary">Buscar Medicamentos</h2>
          <p className="text-muted">
            Encuentra información sobre medicamentos pediátricos y selecciona los que necesitas para más detalles.
          </p>
        </Card.Body>
      </Card>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4 shadow-sm p-4 bg-white rounded">
        <Form.Group controlId="search">
          <Form.Label className="text-primary">Nombre del Medicamento</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el nombre del medicamento"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3 w-100">
          Buscar
        </Button>
      </Form>

      {/* Search Results */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h4 className="text-primary">Resultados</h4>
          {results.length > 0 ? (
            <ListGroup>
{results.map((med) => (
  <ListGroup.Item
    key={med._id}
    className={`d-flex justify-content-between align-items-center ${
      selectedMeds.some((selected) => selected._id === med._id) ? 'bg-primary text-white' : ''
    }`}
  >
    <div>
      <h5 className="mb-1">{med.nombre}</h5>
      <small className="text-muted">Dosis: {med.dosis}</small>
    </div>
    <div className="d-flex justify-content-end">
      <Button
        variant="outline-info"
        size="sm"
        className="me-2"
        onClick={() => handleShowDetails(med)}
      >
        Detalles
      </Button>
      <Button
        variant={selectedMeds.some((selected) => selected._id === med._id) ? 'light' : 'outline-primary'}
        size="sm"
        onClick={() => handleSelect(med)}
      >
        {selectedMeds.some((selected) => selected._id === med._id) ? 'Deseleccionar' : 'Seleccionar'}
      </Button>
    </div>
  </ListGroup.Item>
))}
            </ListGroup>
          ) : (
            <Alert variant="warning" className="mt-3">
              No se encontraron medicamentos.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Interaction Warnings */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          {interacciones.length > 0 ? (
            <Alert variant="danger">
              <h5>¡Advertencia de Interacciones!</h5>
              <ListGroup>
                {interacciones.map((interaccion, idx) => (
                  <ListGroup.Item key={idx}>{interaccion}</ListGroup.Item>
                ))}
              </ListGroup>
            </Alert>
          ) : (
            <Alert variant="success">No se encontraron interacciones.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Selected Medications */}
      {selectedMeds.length > 0 && (
        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="text-primary">Medicamentos Seleccionados</h4>
              <Button variant="danger" size="sm" onClick={clearSelections}>
                Limpiar Todo
              </Button>
            </div>
            <ListGroup className="mt-3">
              {selectedMeds.map((med, idx) => (
                <ListGroup.Item key={idx}>{med.nombre}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Modal para mostrar información detallada */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDrug ? (
            <>
              <h5>Nombre:</h5>
              <p>{selectedDrug.nombre}</p>
              <h5>Dosis:</h5>
              <p>{selectedDrug.dosis}</p>
              <h5>Indicaciones:</h5>
              <p>{selectedDrug.indicaciones}</p>
              <h5>Interacciones:</h5>
              {selectedDrug.interacciones.length > 0 ? (
                <ul>
                  {selectedDrug.interacciones.map((interaccion, idx) => (
                    <li key={idx}>{interaccion}</li>
                  ))}
                </ul>
              ) : (
                <p>No tiene interacciones conocidas.</p>
              )}
            </>
          ) : (
            <p>Cargando...</p>
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

export default DrugSearch;