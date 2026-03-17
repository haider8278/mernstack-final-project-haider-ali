import { Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'instructor') return '/instructor';
    return '/student';
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">LMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>
              <Nav.Link as={NavLink} to="/courses">Courses</Nav.Link>
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to={getDashboardPath()}>Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/" onClick={() => logout()}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="flex-grow-1">
        {children}
      </main>
      <footer className="bg-dark text-light py-3 mt-auto">
        <Container>
          <p className="mb-0 small text-center">&copy; {new Date().getFullYear()} LMS. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
