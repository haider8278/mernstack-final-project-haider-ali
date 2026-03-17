import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor';
    return '/student';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    login(email.trim(), password)
      .then((data) => {
        const path = getDashboardPath(data.user.role);
        navigate(path, { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Login failed');
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
            <h2 className="mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
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
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </Form>
            <p className="mt-3 mb-0 text-center text-muted small">
              Don&apos;t have an account? <Link to="/register">Register</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
