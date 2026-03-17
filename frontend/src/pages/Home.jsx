import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="bg-primary text-white py-5">
        <Container className="py-5 text-center">
          <h1 className="display-4 fw-bold mb-3">Learn Without Limits</h1>
          <p className="lead mb-4">
            Access courses from expert instructors. Enroll, learn at your pace, and track your progress.
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button as={Link} to="/courses" variant="light" size="lg" className="px-4">
              Browse Courses
            </Button>
            {!isAuthenticated && (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="lg" className="px-4">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-4">
                  Register
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">Featured Courses</h2>
          <p className="text-center text-muted mb-4">
            Explore our catalog and start learning today. New courses are added regularly.
          </p>
          <div className="text-center">
            <Button as={Link} to="/courses" variant="primary" size="lg">
              View All Courses
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
