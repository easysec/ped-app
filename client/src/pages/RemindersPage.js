import React, { useContext, useState } from 'react';
import { RemindersContext } from '../contexts/RemindersContext';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function RemindersPage() {
  const { reminders, updateReminders } = useContext(RemindersContext);
  const [showModal, setShowModal] = useState(false);
  const [currentBaby, setCurrentBaby] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    startDate: '',
    startTime: '',
  });

  console.log('Reminders desde contexto:', reminders);

  const groupedByInfant = reminders.reduce((acc, reminder) => {
    const { babyId, babyName } = reminder;
    if (!acc[babyId]) {
      acc[babyId] = {
        babyName,
        reminders: [],
      };
    }
    acc[babyId].reminders.push(reminder);
    return acc;
  }, {});

  console.log('Recordatorios agrupados:', groupedByInfant);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (babyId, reminder = null) => {
    console.log('Abriendo modal para babyId:', babyId, 'Reminder:', reminder);
    setCurrentBaby(babyId);
    setEditingReminder(reminder);
    if (reminder) {
      setFormData({
        medication: reminder.medication,
        dosage: reminder.dosage,
        frequency: reminder.frequency,
        startDate: reminder.startDate,
        startTime: reminder.startTime,
      });
    } else {
      setFormData({
        medication: '',
        dosage: '',
        frequency: '',
        startDate: '',
        startTime: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    console.log('Guardando recordatorio para babyId:', currentBaby);
    console.log('Form data enviada:', formData);

    try {
      if (editingReminder) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/edit-reminder/${currentBaby}/${editingReminder._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/add-reminder/${currentBaby}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setShowModal(false);
      await updateReminders(); // Actualiza los recordatorios después de guardar
      alert('Recordatorio guardado con éxito.');
    } catch (error) {
      console.error('Error al guardar el recordatorio:', error);
      alert('Ocurrió un error al guardar el recordatorio.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Recordatorios Programados</h2>
      {Object.keys(groupedByInfant).length > 0 ? (
        Object.entries(groupedByInfant).map(([babyId, { babyName, reminders }]) => (
          <div key={babyId} className="mb-4">
            <h4>Infante: {babyName}</h4>
            <ul>
              {reminders.map((rem, index) => (
                <li key={index}>
                  <strong>Medicamento:</strong> {rem.medication}
                  <br />
                  <strong>Dosis:</strong> {rem.dosage}
                  <br />
                  <strong>Frecuencia:</strong> {rem.frequency} horas
                  <br />
                  <strong>Inicio:</strong> {rem.startDate} {rem.startTime}
                  <br />
                  <Button
                    variant="warning"
                    className="mt-2"
                    onClick={() => openModal(babyId, rem)}
                  >
                    Editar
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              variant="primary"
              onClick={() => openModal(babyId)}
              className="mt-3"
            >
              Agregar Recordatorio
            </Button>
          </div>
        ))
      ) : (
        <p>No hay recordatorios pendientes.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReminder ? 'Editar Recordatorio' : 'Agregar Recordatorio'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Medicamento</Form.Label>
              <Form.Control
                type="text"
                name="medication"
                value={formData.medication}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dosis</Form.Label>
              <Form.Control
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Frecuencia (horas)</Form.Label>
              <Form.Control
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Hora de Inicio</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RemindersPage;