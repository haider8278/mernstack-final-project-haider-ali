const express = require('express');
const { getAnalytics } = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);
router.use(roleCheck(['admin']));

router.get('/analytics', getAnalytics);

module.exports = router;
