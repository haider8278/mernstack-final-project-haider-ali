import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

export default function StudentCourseLessons() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/courses/${courseId}/lessons`),
    ])
      .then(([courseRes, lessonsRes]) => {
        setCourse(courseRes.data);
        setLessons(lessonsRes.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load content'))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <Alert variant="danger">
        {error || 'Course not found.'}
        <Link to="/student" className="ms-2">Back to My Courses</Link>
      </Alert>
    );
  }

  return (
    <>
      <Link to="/student" className="text-decoration-none small text-muted mb-2 d-inline-block">
        &larr; Back to My Courses
      </Link>
      <h2 className="mb-3">{course.title}</h2>
      {lessons.length === 0 ? (
        <p className="text-muted">No lessons available yet.</p>
      ) : (
        <div className="row g-3">
          {lessons.map((lesson, index) => (
            <div key={lesson._id} className="col-12">
              <Card>
                <Card.Body>
                  <Card.Title className="h6">
                    {index + 1}. {lesson.title}
                  </Card.Title>
                  {lesson.content && (
                    <Card.Text className="text-muted small mb-2">{lesson.content}</Card.Text>
                  )}
                  {lesson.videoUrl && (
                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="small">
                      Watch video
                    </a>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
