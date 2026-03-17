const express = require('express');
const { getMe, updateMe, getUsers, deleteUser } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

router.use(auth);
router.use(roleCheck(['admin']));

router.get('/', getUsers);
router.delete('/:id', deleteUser);

module.exports = router;
