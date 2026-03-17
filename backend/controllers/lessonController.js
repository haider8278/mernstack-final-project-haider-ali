const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * Add a lesson to a course. Auth + instructor (course owner) or admin.
 */
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const isAdmin = req.user.role === 'admin';
    const isOwner = course.instructor.toString() === req.user.id.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Only the course instructor or admin can add lessons.' });
    }
    const { title, content, videoUrl, order } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a lesson title.' });
    }
    const lesson = await Lesson.create({
      title: title.trim(),
      content: (content && content.trim()) || '',
      videoUrl: (videoUrl && videoUrl.trim()) || '',
      order: typeof order === 'number' ? Math.max(0, order) : 0,
      course: course._id,
    });
    const populated = await Lesson.findById(lesson._id).populate('course', 'title');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'Validation failed.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

/**
 * Get lessons for a course. Auth; user must be enrolled or instructor/admin.
 */
const getLessonsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const isAdmin = req.user.role === 'admin';
    const isInstructor = course.instructor.toString() === req.user.id.toString();
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id,
    });
    const isEnrolled = !!enrollment;
    if (!isAdmin && !isInstructor && !isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in this course to view lessons.' });
    }

    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1, createdAt: 1 });
    res.json(lessons);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = {
  addLesson,
  getLessonsByCourse,
};
