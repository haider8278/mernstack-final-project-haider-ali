const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * GET /api/users/me – Auth. Return current user (exclude password).
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

/**
 * PUT /api/users/me – Auth. Update current user name/email.
 */
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { name, email } = req.body;
    if (name !== undefined && name.trim()) user.name = name.trim();
    if (email !== undefined && email.trim()) user.email = email.trim().toLowerCase();
    await user.save();
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

/**
 * GET /api/users – Auth + role admin. Return all users (exclude passwords).
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

/**
 * DELETE /api/users/:id – Auth + role admin. Delete user.
 * Handle constraint: enrollments, courses as instructor.
 */
const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const enrollmentCount = await Enrollment.countDocuments({ student: userToDelete._id });
    const courseCount = await Course.countDocuments({ instructor: userToDelete._id });
    if (enrollmentCount > 0 || courseCount > 0) {
      return res.status(400).json({
        message:
          'Cannot delete user with existing enrollments or courses. Remove enrollments and reassign or delete courses first.',
      });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = {
  getMe,
  updateMe,
  getUsers,
  deleteUser,
};
