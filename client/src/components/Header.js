import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  HouseDoor,
  Search,
  PersonPlus,
  Person,
  Gear,
  BoxArrowRight,
  BoxArrowInRight,
  Book,
  Bell,
} from 'react-bootstrap-icons';
import appLogo from '../assets/images/logo.png'; // Importing the logo

function Header({ token = null, role = null, handleLogout = () => {} }) {
  const userName = 'Usuario';
  const userPhoto = 'https://via.placeholder.com/30';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-lg border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-uppercase font-weight-bold text-white d-flex align-items-center">
          <Image src={appLogo} roundedCircle width="40" height="40" className="me-2" />
          <span style={{ fontSize: '1.5rem' }}>Pediatric Meds</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              <HouseDoor className="me-2" /> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/search-drugs" className="text-white">
              <Search className="me-2" /> Buscar Medicamentos
            </Nav.Link>
            <Nav.Link as={Link} to="/learning" className="text-white">
              <Book className="me-2" /> Aprendizaje
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {token ? (
              <>
                <Nav.Link as={Link} to="/create-profile" className="text-white">
                  <PersonPlus className="me-2" /> Crear Perfil de Bebé
                </Nav.Link>
                {role === 'admin' && (
                  <Nav.Link as={Link} to="/admin-console" className="text-white">
                    <Gear className="me-2" /> Consola
                  </Nav.Link>
                )}
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <Image src={userPhoto} roundedCircle width="30" height="30" className="me-2" />
                      {userName}
                    </span>
                  }
                  id="profile-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <Person className="me-2" /> Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reminders">
                    <Bell className="me-2" /> Recordatorios
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <BoxArrowRight className="me-2" /> Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <NavDropdown title="Cuenta" id="account-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/login">
                  <BoxArrowInRight className="me-2" /> Iniciar Sesión
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register">
                  <PersonPlus className="me-2" /> Registrarse
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
