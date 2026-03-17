import { Container } from 'react-bootstrap';

export default function About() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">About Our LMS</h1>
      <p className="lead">
        This Learning Management System helps students discover courses, enroll, and track their progress—and gives instructors and admins the tools to manage content and users.
      </p>
      <hr className="my-4" />
      <h2 className="h4 mb-3">For Students</h2>
      <p>
        Browse courses by category, view details and instructor info, and enroll with one click. Access your enrolled courses and track progress from your dashboard.
      </p>
      <h2 className="h4 mb-3">For Instructors</h2>
      <p>
        Create and manage courses, upload lessons (with video or text content), and keep your materials organized. You own your course content and can update it anytime.
      </p>
      <h2 className="h4 mb-3">For Admins</h2>
      <p>
        Manage users and courses across the platform, view analytics and reports, and ensure a smooth experience for everyone.
      </p>
    </Container>
  );
}
