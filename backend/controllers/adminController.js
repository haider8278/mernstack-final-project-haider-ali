const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * GET /api/admin/analytics – Auth + role admin.
 * Return aggregates: total users, total courses, total enrollments, optionally by role or by course.
 */
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, usersByRole] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ]);

    const roleCounts = {};
    usersByRole.forEach((r) => {
      roleCounts[r._id] = r.count;
    });

    const enrollmentsByCourse = await Enrollment.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseDoc',
        },
      },
      { $unwind: '$courseDoc' },
      { $project: { courseTitle: '$courseDoc.title', count: 1, _id: 0 } },
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      usersByRole: roleCounts,
      topCoursesByEnrollment: enrollmentsByCourse,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = {
  getAnalytics,
};
