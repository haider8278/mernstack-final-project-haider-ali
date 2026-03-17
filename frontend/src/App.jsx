import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import CourseListing from './pages/CourseListing';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import StudentLayout from './components/StudentLayout';
import MyCourses from './pages/student/MyCourses';
import Profile from './pages/student/Profile';
import StudentCourseLessons from './pages/student/StudentCourseLessons';
import InstructorLayout from './components/InstructorLayout';
import ManageCourses from './pages/instructor/ManageCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import UploadLessons from './pages/instructor/UploadLessons';
import AdminLayout from './components/AdminLayout';
import Reports from './pages/admin/Reports';
import ManageUsers from './pages/admin/ManageUsers';
import AdminManageCourses from './pages/admin/ManageCourses';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<MyCourses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses/:courseId/lessons" element={<StudentCourseLessons />} />
        </Route>
        <Route path="/instructor" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorLayout /></ProtectedRoute>}>
          <Route index element={<ManageCourses />} />
          <Route path="create" element={<CreateCourse />} />
          <Route path="edit/:id" element={<EditCourse />} />
          <Route path="upload-lessons" element={<UploadLessons />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Reports />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="courses" element={<AdminManageCourses />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
