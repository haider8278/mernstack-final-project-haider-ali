const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const lessonRoutes = require('./lessonRoutes');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { createCourseRules, updateCourseRules } = require('../middleware/validationRules');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', auth, roleCheck(['instructor', 'admin']), createCourseRules(), validate, createCourse);
router.put('/:id', auth, roleCheck(['instructor', 'admin']), updateCourseRules(), validate, updateCourse);
router.delete('/:id', auth, roleCheck(['instructor', 'admin']), deleteCourse);

router.use('/:id/lessons', lessonRoutes);

module.exports = router;
