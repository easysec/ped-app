import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

function AdminConsole() {
  return (
    <Container className="mt-5">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2>Consola de Administración</h2>
          <ul>
            <li>
              <Link to="/manage-drugs">Gestionar Medicamentos</Link>
            </li>
            <li>
              <Link to="/manage-users">Administrar Usuarios</Link>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminConsole;
