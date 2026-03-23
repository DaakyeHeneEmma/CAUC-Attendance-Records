const express = require('express');
const router = express.Router();
const { register, login, getMe, getFaculties } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', auth(['admin', 'faculty']), register);
router.post('/login', login);
router.get('/me', auth(), getMe);
router.get('/faculties', auth(['admin']), getFaculties);

module.exports = router;
