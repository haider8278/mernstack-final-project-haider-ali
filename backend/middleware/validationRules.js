const { body, param } = require('express-validator');

const registerRules = () => [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }).withMessage('Name must be at most 100 characters.'),
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Please provide a valid email.'),
  body('password').notEmpty().withMessage('Password is required.').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

const loginRules = () => [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Please provide a valid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const createCourseRules = () => [
  body('title').trim().notEmpty().withMessage('Course title is required.').isLength({ max: 200 }).withMessage('Title must be at most 200 characters.'),
  body('description').optional({ values: 'null' }).trim(),
  body('category').optional({ values: 'null' }).trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number.').toFloat(),
];

const updateCourseRules = () => [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.').isLength({ max: 200 }).withMessage('Title must be at most 200 characters.'),
  body('description').optional({ values: 'null' }).trim(),
  body('category').optional({ values: 'null' }).trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number.').toFloat(),
];

const addLessonRules = () => [
  body('title').trim().notEmpty().withMessage('Lesson title is required.').isLength({ max: 200 }).withMessage('Title must be at most 200 characters.'),
  body('content').optional({ values: 'null' }).trim(),
  body('videoUrl').optional({ values: 'null' }).trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer.').toInt(),
];

const enrollRules = () => [
  body('courseId').notEmpty().withMessage('courseId is required.').isMongoId().withMessage('Invalid course ID.'),
];

const mongoIdParam = (paramName) => [param(paramName).isMongoId().withMessage('Invalid ID.')];

module.exports = {
  registerRules,
  loginRules,
  createCourseRules,
  updateCourseRules,
  addLessonRules,
  enrollRules,
  mongoIdParam,
};
