import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/my-courses')
      .then((res) => setEnrollments(res.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">You are not enrolled in any courses yet.</p>
        <Link to="/courses" className="btn btn-primary">Browse courses</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4">My Courses</h2>
      <div className="row g-3">
        {enrollments.map((enrollment) => {
          const course = enrollment.course;
          if (!course) return null;
          const progress = Math.min(100, Math.max(0, Number(enrollment.progress) || 0));
          return (
            <div key={enrollment._id} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {course.instructor?.name && `Instructor: ${course.instructor.name}`}
                  </Card.Text>
                  <ProgressBar now={progress} label={`${progress}%`} className="mb-2" />
                  <div className="d-flex gap-2">
                    <Link
                      to={`/student/courses/${course._id}/lessons`}
                      className="btn btn-sm btn-primary"
                    >
                      View content
                    </Link>
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Details
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
