import React, { useState } from 'react';
import { Row, Col, Container, Form, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

function InfantProfileForm() {
  const [infant, setInfant] = useState({
    name: '',
    age: '',
    weight: { kg: '', g: '' },
    height: '',
    allergies: [],
    reminders: [],
  });
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    startDate: '',
    startTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfant({
      ...infant,
      [name]: value,
    });
  };

  const handleWeightChange = (e, key) => {
    const value = e.target.value;
    setInfant((prev) => ({
      ...prev,
      weight: {
        ...prev.weight,
        [key]: value,
      },
    }));
  };

  const handleAllergiesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setInfant({ ...infant, allergies: selectedOptions });
  };

  const handleReminderChange = (e) => {
    const { name, value } = e.target;
    setNewReminder({ ...newReminder, [name]: value });
  };

  const addReminder = () => {
    setInfant((prev) => ({
      ...prev,
      reminders: [...prev.reminders, newReminder],
    }));
    setNewReminder({ medication: '', dosage: '', frequency: '', startDate: '', startTime: '' });
    setShowReminderModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    // Prepare payload
    const payload = {
      name: infant.name,
      age: parseInt(infant.age, 10),
      weight: parseFloat(infant.weight.kg) + parseFloat(infant.weight.g) / 1000, // Convert to kg
      height: parseFloat(infant.height),
      allergies: infant.allergies,
      reminders: infant.reminders,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-infant`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Perfil del infante creado con éxito');
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al crear el perfil del infante:', error.response?.data || error.message);
      alert('Error al crear el perfil del infante');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="text-primary text-center">Crear Perfil de Infante</h2>
          <p className="text-muted text-center">
            Complete los datos del infante para crear su perfil.
          </p>
          <Form onSubmit={handleSubmit} className="mt-4">
            {/* Name */}
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={infant.name}
                onChange={handleChange}
                placeholder="Ingresa el nombre del infante"
                required
              />
            </Form.Group>

            {/* Age */}
            <Form.Group controlId="formAge" className="mb-3">
              <Form.Label>Edad (en meses)</Form.Label>
              <Form.Select
                name="age"
                value={infant.age}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione la edad</option>
                {Array.from({ length: 63 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} meses
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Weight */}
            <Form.Group controlId="formWeight" className="mb-3">
              <Form.Label>Peso</Form.Label>
              <Row>
                <Col>
                  <Form.Select
                    onChange={(e) => handleWeightChange(e, 'kg')}
                    required
                  >
                    <option value="">Kilos</option>
                    {Array.from({ length: 50 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} kg
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    onChange={(e) => handleWeightChange(e, 'g')}
                  >
                    <option value="">Gramos</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i * 100}>
                        {i * 100} g
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Height */}
            <Form.Group controlId="formHeight" className="mb-3">
              <Form.Label>Altura (cm)</Form.Label>
              <Form.Control
                type="number"
                name="height"
                value={infant.height}
                onChange={handleChange}
                placeholder="Ingresa la altura en centímetros"
                required
              />
            </Form.Group>

            {/* Allergies */}
            <Form.Group controlId="formAllergies" className="mb-3">
              <Form.Label>Alergias</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={infant.allergies}
                onChange={handleAllergiesChange}
              >
                <option value="Polen">Polen</option>
                <option value="Polvo">Polvo</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Medicamentos">Medicamentos</option>
                <option value="Animales">Animales</option>
              </Form.Control>
              <small className="text-muted">
                Mantén presionada la tecla Ctrl (Cmd en Mac) para seleccionar múltiples opciones
              </small>
            </Form.Group>

            {/* Add Reminder Button */}
            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => setShowReminderModal(true)}
            >
              Agregar Recordatorio de Medicamento
            </Button>

            {/* Reminder List */}
            {infant.reminders.length > 0 && (
              <div className="mb-4">
                <h5>Recordatorios Agregados:</h5>
                <ul>
                  {infant.reminders.map((reminder, index) => (
                    <li key={index}>
                      {`${reminder.medication} - ${reminder.dosage} - ${reminder.frequency} - ${reminder.startDate} ${reminder.startTime}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="primary" type="submit" className="w-100">
              Crear Perfil
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Reminder Modal */}
      <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Recordatorio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMedication" className="mb-3">
              <Form.Label>Medicamento</Form.Label>
              <Form.Control
                type="text"
                name="medication"
                value={newReminder.medication}
                onChange={handleReminderChange}
                placeholder="Nombre del medicamento"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDosage" className="mb-3">
              <Form.Label>Dosis</Form.Label>
              <Form.Control
                type="text"
                name="dosage"
                value={newReminder.dosage}
                onChange={handleReminderChange}
                placeholder="Dosis (ej. 5 ml)"
                required
              />
            </Form.Group>

            <Form.Group controlId="formFrequency" className="mb-3">
              <Form.Label>Frecuencia</Form.Label>
              <Form.Control
                type="text"
                name="frequency"
                value={newReminder.frequency}
                onChange={handleReminderChange}
                placeholder="Frecuencia (ej. cada 8 horas)"
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartDate" className="mb-3">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newReminder.startDate}
                onChange={handleReminderChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartTime" className="mb-3">
              <Form.Label>Hora de Inicio</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={newReminder.startTime}
                onChange={handleReminderChange}
                required
              />
            </Form.Group>

            <Button variant="primary" onClick={addReminder} className="w-100">
              Guardar Recordatorio
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default InfantProfileForm;