import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';

export default function CourseListing() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/courses')
      .then((res) => {
        if (!cancelled) setCourses(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load courses');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2 text-muted">Loading courses...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">All Courses</h1>
      {courses.length === 0 ? (
        <p className="text-muted">No courses available yet. Check back later.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {courses.map((course) => (
            <Col key={course._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {course.description ? (course.description.slice(0, 120) + (course.description.length > 120 ? '…' : '')) : 'No description'}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-secondary">{course.category || 'General'}</span>
                    <span className="fw-semibold">${Number(course.price ?? 0).toFixed(2)}</span>
                  </div>
                  <Card.Footer className="bg-transparent border-0 px-0 pb-0 pt-2">
                    <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
