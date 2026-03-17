const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * POST /api/enroll – Auth + role student. Body: courseId. Create Enrollment if not already enrolled.
 */
const enroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'Please provide courseId.' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      progress: 0,
    });
    const populated = await Enrollment.findById(enrollment._id)
      .populate('course', 'title description category price instructor')
      .populate('student', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

/**
 * GET /api/my-courses – Auth + role student. Return enrollments with course (and optionally lesson count or progress).
 */
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name email' } })
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = {
  enroll,
  getMyCourses,
};
