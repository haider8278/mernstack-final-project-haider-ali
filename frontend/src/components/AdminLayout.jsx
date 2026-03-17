import { Outlet, NavLink } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';

export default function AdminLayout() {
  return (
    <Container className="py-4">
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/admin" end>Reports</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/admin/users">Manage Users</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/admin/courses">Manage Courses</Nav.Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
}
