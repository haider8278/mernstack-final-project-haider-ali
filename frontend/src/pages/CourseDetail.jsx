import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api.get(`/courses/${id}`)
      .then((res) => {
        if (!cancelled) setCourse(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load course');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    if (user?.role !== 'student') {
      setEnrollError('Only students can enroll. Use your student account.');
      return;
    }
    setEnrollError(null);
    setEnrolling(true);
    api.post('/enroll', { courseId: id })
      .then(() => {
        navigate('/student');
      })
      .catch((err) => {
        setEnrollError(err.response?.data?.message || err.message || 'Enrollment failed');
      })
      .finally(() => {
        setEnrolling(false);
      });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2 text-muted">Loading course...</p>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Course not found.'}</Alert>
        <Link to="/courses">Back to courses</Link>
      </Container>
    );
  }

  const instructorName = course.instructor?.name || 'Instructor';

  return (
    <Container className="py-5">
      <Link to="/courses" className="text-decoration-none small text-muted mb-3 d-inline-block">
        &larr; Back to courses
      </Link>
      <div className="border rounded p-4 bg-light">
        <h1>{course.title}</h1>
        <p className="text-muted mb-2">
          <span className="badge bg-secondary me-2">{course.category || 'General'}</span>
          By {instructorName}
        </p>
        <p className="lead">{course.description || 'No description provided.'}</p>
        <p className="fw-semibold">Price: ${Number(course.price ?? 0).toFixed(2)}</p>
        {user?.role === 'student' && (
          <>
            {enrollError && <Alert variant="danger" className="mt-2">{enrollError}</Alert>}
            <Button variant="primary" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Enrolling…' : 'Enroll'}
            </Button>
          </>
        )}
        {!isAuthenticated && (
          <Button variant="primary" as={Link} to="/login" state={{ from: { pathname: `/courses/${id}` } }}>
            Login to Enroll
          </Button>
        )}
      </div>
    </Container>
  );
}
