import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout()
            navigate("/login")
        } catch {
            setError('Failed to log out. Please, try again.')
        }
    }

    return (
      <Navbar className="bg-body-tertiary" fixed="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                <Button variant="link" onClick={handleLogout} >Log Out</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
  
export default Navigation;