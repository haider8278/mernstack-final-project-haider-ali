import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Table, Modal } from 'react-bootstrap';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setDeleting(true);
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setDeleteId(null);
      })
      .catch((err) => alert(err.response?.data?.message || err.message || 'Delete failed'))
      .finally(() => setDeleting(false));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2 className="mb-4">Manage Users</h2>
      <Card className="shadow-sm">
        <Card.Body>
          {users.length === 0 ? (
            <p className="text-muted mb-0">No users.</p>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge bg-secondary">{user.role}</span></td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setDeleteId(user._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={!!deleteId} onHide={() => !deleting && setDeleteId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure? Users with enrollments or courses cannot be deleted.</Modal.Body>
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
