const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const getCourses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category.trim()) filter.category = category.trim();
    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.json(course);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a course title.' });
    }
    const course = await Course.create({
      title: title.trim(),
      description: (description && description.trim()) || '',
      category: (category && category.trim()) || 'General',
      price: typeof price === 'number' ? Math.max(0, price) : 0,
      instructor: req.user.id,
    });
    const populated = await Course.findById(course._id).populate('instructor', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'Validation failed.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const isAdmin = req.user.role === 'admin';
    const isOwner = course.instructor.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You can only update your own courses.' });
    }
    const { title, description, category, price } = req.body;
    if (title !== undefined) course.title = title.trim();
    if (description !== undefined) course.description = description.trim();
    if (category !== undefined) course.category = category.trim();
    if (typeof price === 'number') course.price = Math.max(0, price);
    await course.save();
    const populated = await Course.findById(course._id).populate('instructor', 'name email');
    res.json(populated);
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

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const isAdmin = req.user.role === 'admin';
    const isOwner = course.instructor.toString() === req.user.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You can only delete your own courses.' });
    }
    const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
    if (enrollmentCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete course with existing enrollments. Remove or reassign enrollments first.',
      });
    }
    await Lesson.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
