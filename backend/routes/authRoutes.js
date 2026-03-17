const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerRules, loginRules } = require('../middleware/validationRules');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post('/register', registerRules(), validate, register);
router.post('/login', loginRules(), validate, login);

module.exports = router;
