import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

function ManageDrugs() {
  const [drugs, setDrugs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    dosis: '',
    interacciones: [],
    indicaciones: '', // Nuevo campo para las indicaciones
  });
  const [editingDrug, setEditingDrug] = useState(null);

  // Obtener medicamentos desde el backend
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/medicamentos`);
        setDrugs(response.data);
      } catch (error) {
        console.error('Error al obtener medicamentos:', error);
      }
    };

    fetchDrugs();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar cambios en el dropdown de interacciones
  const handleInteractionChange = (selectedOptions) => {
    const selectedInteractions = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, interacciones: selectedInteractions });
  };

  // Guardar medicamento (agregar o editar)
  const handleSave = async () => {
    try {
      if (editingDrug) {
        // Editar medicamento
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/medicamentos/${editingDrug._id}`,
          formData
        );
        alert('Medicamento actualizado con éxito.');
      } else {
        // Agregar medicamento
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/medicamentos`, formData);
        alert('Medicamento agregado con éxito.');
      }
      setShowModal(false);
      window.location.reload(); // Recargar para reflejar cambios
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
      alert('Ocurrió un error al guardar el medicamento.');
    }
  };

  // Eliminar medicamento
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/medicamentos/${id}`);
        alert('Medicamento eliminado con éxito.');
        setDrugs(drugs.filter((drug) => drug._id !== id));
      } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        alert('Ocurrió un error al eliminar el medicamento.');
      }
    }
  };

  // Abrir modal para agregar o editar
  const openModal = (drug = null) => {
    setEditingDrug(drug);
    if (drug) {
      setFormData({
        nombre: drug.nombre,
        dosis: drug.dosis,
        interacciones: drug.interacciones,
        indicaciones: drug.indicaciones || '', // Cargar el campo si ya existe
      });
    } else {
      setFormData({
        nombre: '',
        dosis: '',
        interacciones: [],
        indicaciones: '', // Inicializar con una cadena vacía
      });
    }
    setShowModal(true);
  };

  // Generar opciones para el dropdown
  const drugOptions = drugs.map((drug) => ({
    value: drug.nombre,
    label: drug.nombre,
  }));

  return (
    <Container className="mt-5">
      <h2 className="text-primary">Gestionar Medicamentos</h2>
      <Button variant="primary" className="mb-3" onClick={() => openModal()}>
        Agregar Medicamento
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dosis</th>
            <th>Interacciones</th>
            <th>Indicaciones</th> {/* Nueva columna */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug) => (
            <tr key={drug._id}>
              <td>{drug.nombre}</td>
              <td>{drug.dosis}</td>
              <td>{drug.interacciones.join(', ')}</td>
              <td>{drug.indicaciones}</td> {/* Mostrar indicaciones */}
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openModal(drug)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(drug._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para agregar/editar medicamentos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDrug ? 'Editar Medicamento' : 'Agregar Medicamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dosis</Form.Label>
              <Form.Control
                type="text"
                name="dosis"
                value={formData.dosis}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Interacciones</Form.Label>
              <Select
                isMulti
                options={drugOptions}
                value={drugOptions.filter((option) =>
                  formData.interacciones.includes(option.value)
                )}
                onChange={handleInteractionChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Indicaciones</Form.Label> {/* Campo para indicaciones */}
              <Form.Control
                as="textarea"
                name="indicaciones"
                rows={3}
                value={formData.indicaciones}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ManageDrugs;