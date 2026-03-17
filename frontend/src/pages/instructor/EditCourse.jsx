import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../../services/api';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then((res) => {
        setTitle(res.data.title || '');
        setDescription(res.data.description || '');
        setCategory(res.data.category || 'General');
        setPrice(res.data.price ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const priceNum = parseFloat(price);
    api.put(`/courses/${id}`, {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      price: isNaN(priceNum) ? 0 : Math.max(0, priceNum),
    })
      .then(() => navigate('/instructor'))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to update'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <p className="text-muted">Loading...</p>;
  }

  if (error && !title) {
    return (
      <Alert variant="danger">
        {error}
        <Button variant="link" onClick={() => navigate('/instructor')}>Back to courses</Button>
      </Alert>
    );
  }

  return (
    <>
      <h2 className="mb-4">Edit Course</h2>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => navigate('/instructor')}>
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
