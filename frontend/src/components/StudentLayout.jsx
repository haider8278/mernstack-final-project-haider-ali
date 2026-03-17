import { Outlet, NavLink } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';

export default function StudentLayout() {
  return (
    <Container className="py-4">
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/student" end>My Courses</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/student/profile">Profile</Nav.Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
}
