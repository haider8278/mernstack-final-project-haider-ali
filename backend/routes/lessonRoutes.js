const express = require('express');
const { addLesson, getLessonsByCourse } = require('../controllers/lessonController');
const { auth } = require('../middleware/auth');
const { addLessonRules } = require('../middleware/validationRules');
const { validate } = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

router.get('/', auth, getLessonsByCourse);
router.post('/', auth, addLessonRules(), validate, addLesson);

module.exports = router;
