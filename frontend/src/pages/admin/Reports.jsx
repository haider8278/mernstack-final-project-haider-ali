import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Table } from 'react-bootstrap';
import api from '../../services/api';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const roleCounts = data?.usersByRole || {};
  const topCourses = data?.topCoursesByEnrollment || [];

  return (
    <>
      <h2 className="mb-4">Reports &amp; Analytics</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h6 text-muted">Total Users</Card.Title>
              <Card.Text className="h3 mb-0">{data?.totalUsers ?? 0}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h6 text-muted">Total Courses</Card.Title>
              <Card.Text className="h3 mb-0">{data?.totalCourses ?? 0}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h6 text-muted">Total Enrollments</Card.Title>
              <Card.Text className="h3 mb-0">{data?.totalEnrollments ?? 0}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Header>Users by role</Card.Header>
        <Card.Body>
          <Table size="sm" bordered>
            <tbody>
              <tr>
                <td>Admin</td>
                <td>{roleCounts.admin ?? 0}</td>
              </tr>
              <tr>
                <td>Instructor</td>
                <td>{roleCounts.instructor ?? 0}</td>
              </tr>
              <tr>
                <td>Student</td>
                <td>{roleCounts.student ?? 0}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header>Top courses by enrollment</Card.Header>
        <Card.Body>
          {topCourses.length === 0 ? (
            <p className="text-muted mb-0">No enrollments yet.</p>
          ) : (
            <Table size="sm" bordered>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((row, i) => (
                  <tr key={i}>
                    <td>{row.courseTitle}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
