import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ManageCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const myCourses = courses.filter(
    (c) => c.instructor?._id === user?._id || c.instructor === user?.id
  );

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
      {myCourses.length === 0 ? (
        <>
          <p className="text-muted">You have not created any courses yet.</p>
          <Button variant="primary" as={Link} to="/instructor/create">Create your first course</Button>
        </>
      ) : (
        <div className="row g-3">
          {myCourses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="text-muted small">{course.category}</Card.Text>
                  <Card.Text className="small">${Number(course.price ?? 0).toFixed(2)}</Card.Text>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/instructor/edit/${course._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setDeleteId(course._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      as={Link}
                      to={`/instructor/upload-lessons?courseId=${course._id}`}
                    >
                      Add lessons
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
        <Modal.Body>Are you sure? This cannot be undone.</Modal.Body>
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
