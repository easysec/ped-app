import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';

function ProfilePage() {
  const [profile, setProfile] = useState(null); // Datos del perfil del usuario
  const [selectedBaby, setSelectedBaby] = useState(null); // Infante seleccionado
  const [showModal, setShowModal] = useState(false); // Mostrar/ocultar modal

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil', error);
      }
    };

    fetchProfile();
  }, []);

  // Eliminar recordatorio
const deleteReminder = async (index) => {
  console.log('Baby ID:', selectedBaby._id);
  console.log('Reminder Index:', index);

  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-reminder/${selectedBaby._id}/${index}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Actualizar el estado local
    const updatedReminders = [...selectedBaby.reminders];
    updatedReminders.splice(index, 1);
    setSelectedBaby((prev) => ({ ...prev, reminders: updatedReminders }));

    setProfile((prev) => ({
      ...prev,
      babies: prev.babies.map((baby) =>
        baby._id === selectedBaby._id
          ? { ...baby, reminders: updatedReminders }
          : baby
      ),
    }));
  } catch (error) {
    console.error('Error al eliminar el recordatorio:', error);
  }
};

  
  // Eliminar infante
const deleteBaby = async (babyId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-baby/${babyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Actualizar el estado local para eliminar el infante de la lista
    setProfile((prev) => ({
      ...prev,
      babies: prev.babies.filter((baby) => baby._id !== babyId),
    }));
    setShowModal(false); // Cerrar el modal
    console.log("Infante eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el infante:", error);
  }
};


  const handleBabyClick = (baby) => {
    setSelectedBaby(baby);
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      {profile ? (
        <div>
          <Card className="shadow-lg border-0 mb-5">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="text-center">
                  <Image
                    src="https://via.placeholder.com/100"
                    roundedCircle
                    width="100"
                    height="100"
                    alt="Usuario"
                  />
                </Col>
                <Col md={9}>
                  <Card.Title className="text-primary">
                    {profile.firstName} {profile.lastName}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Usuario:</strong> {profile.username}
                    <br />
                    <strong>Correo:</strong> {profile.email}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <h2 className="text-primary mb-4">Perfiles de Infantes</h2>
          {profile.babies && profile.babies.length > 0 ? (
            <Row>
              {profile.babies.map((baby, index) => (
                <Col key={index} md={6} className="mb-4">
                  <Card
                    className="shadow-sm border-0 h-100"
                    onClick={() => handleBabyClick(baby)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={4} className="text-center">
                          <Image
                            src="https://via.placeholder.com/80"
                            roundedCircle
                            width="80"
                            height="80"
                            alt="Infante"
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Title className="text-secondary">{baby.name}</Card.Title>
                          <Card.Text>
                            <strong>Edad:</strong> {baby.age} años
                            <br />
                            <strong>Peso:</strong> {baby.weight} kg
                            <br />
                            <strong>Altura:</strong> {baby.height} cm
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No se han agregado perfiles de infantes aún.</p>
          )}

          {/* Modal para mostrar detalles del infante */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedBaby ? `Detalles de ${selectedBaby.name}` : 'Detalles del Infante'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBaby ? (
                <div>
                  <h5>Información General:</h5>
                  <p>
                    <strong>Edad:</strong> {selectedBaby.age} años
                    <br />
                    <strong>Peso:</strong> {selectedBaby.weight} kg
                    <br />
                    <strong>Altura:</strong> {selectedBaby.height} cm
                    <br />
                    <strong>Alergias:</strong> {selectedBaby.allergies.join(', ') || 'Ninguna'}
                  </p>
                  <h5>Recordatorios de Medicamentos:</h5>
                  {selectedBaby.reminders && selectedBaby.reminders.length > 0 ? (
                    <ul>
                      {selectedBaby.reminders.map((reminder, index) => (
                        <li key={index}>
                          <strong>Medicamento:</strong> {reminder.medication} <br />
                          <strong>Dosis:</strong> {reminder.dosage} <br />
                          <strong>Frecuencia:</strong> {reminder.frequency} <br />
                          <strong>Inicio:</strong> {reminder.startDate} {reminder.startTime}
                          <br />
                          <Button
  variant="danger"
  size="sm"
  onClick={() => deleteReminder(index)}
  className="mt-2"
>
  Eliminar Recordatorio
</Button>

                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay recordatorios para este infante.</p>
                  )}
                  <Button
                    variant="danger"
                    className="mt-4"
                    onClick={() => deleteBaby(selectedBaby._id)}
                  >
                    Eliminar Infante
                  </Button>
                </div>
              ) : (
                <p>Cargando detalles...</p>
              )}
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <p>Cargando datos del perfil...</p>
      )}
    </Container>
  );
}

export default ProfilePage;
