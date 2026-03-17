import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../../services/api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const priceNum = parseFloat(price);
    api.post('/courses', {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      price: isNaN(priceNum) ? 0 : Math.max(0, priceNum),
    })
      .then(() => navigate('/instructor'))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to create course'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h2 className="mb-4">Create Course</h2>
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Course title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. General, Web Dev"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create course'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
