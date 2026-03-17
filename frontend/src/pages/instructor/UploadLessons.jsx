import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UploadLessons() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('courseId');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(preselectedId || '');
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data || []))
      .finally(() => setLoadingCourses(false));
  }, []);

  const myCourses = courses.filter(
    (c) => c.instructor?._id === user?._id || c.instructor === user?.id
  );

  useEffect(() => {
    if (preselectedId && !selectedCourseId) setSelectedCourseId(preselectedId);
  }, [preselectedId, selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      return;
    }
    setLoadingLessons(true);
    api.get(`/courses/${selectedCourseId}/lessons`)
      .then((res) => setLessons(res.data || []))
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));

      console.log(lessons);
  }, [selectedCourseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError('Please select a course.');
      return;
    }
    setError(null);
    setMessage(null);
    setSubmitting(true);
    const orderNum = parseInt(order, 10);
    api.post(`/courses/${selectedCourseId}/lessons`, {
      title: title.trim(),
      content: content.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      order: isNaN(orderNum) ? 0 : Math.max(0, orderNum),
    })
      .then(() => {
        setMessage('Lesson added.');
        setTitle('');
        setContent('');
        setVideoUrl('');
        setOrder(lessons.length);
        return api.get(`/courses/${selectedCourseId}/lessons`);
      })
      .then((res) => setLessons(res.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to add lesson'))
      .finally(() => setSubmitting(false));
  };

  if (loadingCourses) {
    return <p className="text-muted">Loading courses...</p>;
  }

  return (
    <>
      <h2 className="mb-4">Upload Lessons</h2>

      <Form.Group className="mb-4">
        <Form.Label>Select course</Form.Label>
        <Form.Select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {myCourses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedCourseId && (
        <>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Lesson title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Lesson title"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Content (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Text content"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Video URL (optional)</Form.Label>
                  <Form.Control
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Adding…' : 'Add lesson'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <h5 className="mb-2">Existing lessons</h5>
          {loadingLessons ? (
            <p className="text-muted">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="text-muted">No lessons yet. Add one above.</p>
          ) : (
            <ListGroup>
              {lessons.map((lesson, index) => (
                <ListGroup.Item key={lesson._id}>
                  {index + 1}. {lesson.title}
                  {lesson.videoUrl && (
                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="ms-2 small">Video</a>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      )}
    </>
  );
}
