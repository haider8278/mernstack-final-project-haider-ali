import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor';
    return '/student';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    register(name.trim(), email.trim(), password)
      .then((data) => {
        const path = getDashboardPath(data.user.role);
        navigate(path, { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Registration failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h2 className="mb-4">Register</h2>
            <p className="text-muted small">Create a student account to enroll in courses.</p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </Form>
            <p className="mt-3 mb-0 text-center text-muted small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
