import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

export default function AdminManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setDeleting(true);
    api.delete(`/courses/${id}`)
      .then(() => {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        setDeleteId(null);
      })
      .catch((err) => alert(err.response?.data?.message || err.message || 'Delete failed'))
      .finally(() => setDeleting(false));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2 className="mb-4">Manage Courses</h2>
      {courses.length === 0 ? (
        <p className="text-muted">No courses.</p>
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    Instructor: {course.instructor?.name || '—'}
                  </Card.Text>
                  <Card.Text className="small">${Number(course.price ?? 0).toFixed(2)} · {course.category}</Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" as={Link} to={`/courses/${course._id}`}>
                      View
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setDeleteId(course._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal show={!!deleteId} onHide={() => !deleting && setDeleteId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete course</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure? Courses with enrollments cannot be deleted.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteId)} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
