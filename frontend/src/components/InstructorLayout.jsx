import { Outlet, NavLink } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';

export default function InstructorLayout() {
  return (
    <Container className="py-4">
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/instructor" end>Manage Courses</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/instructor/create">Create Course</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/instructor/upload-lessons">Upload Lessons</Nav.Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
}
