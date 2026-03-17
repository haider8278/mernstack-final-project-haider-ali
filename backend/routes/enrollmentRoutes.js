const express = require('express');
const { enroll, getMyCourses } = require('../controllers/enrollmentController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const { enrollRules } = require('../middleware/validationRules');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post('/enroll', auth, roleCheck(['student']), enrollRules(), validate, enroll);
router.get('/my-courses', auth, roleCheck(['student']), getMyCourses);

module.exports = router;
