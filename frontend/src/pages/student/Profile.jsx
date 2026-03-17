import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    api.put('/users/me', { name: name.trim(), email: email.trim() })
      .then((res) => {
        setMessage('Profile updated successfully.');
        const u = { ...user, name: res.data.name, email: res.data.email };
        localStorage.setItem('lms_user', JSON.stringify(u));
        window.dispatchEvent(new Event('storage'));
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Update failed'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h2 className="mb-4">Profile</h2>
      <Card className="shadow-sm">
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
