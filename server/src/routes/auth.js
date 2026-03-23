const express = require('express');
const router = express.Router();
const { register, login, getMe, getLecturers } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', auth(['admin']), register);
router.post('/login', login);
router.get('/me', auth(), getMe);
router.get('/lecturers', auth(['admin']), getLecturers);

module.exports = router;
