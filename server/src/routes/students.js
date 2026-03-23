const express = require('express');
const router = express.Router();
const { getStudents, createStudent, getStudent, updateStudent, getStudentAttendance } = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/', auth(['admin', 'faculty']), getStudents);
router.post('/', auth(['admin']), createStudent);
router.get('/:id', auth(), getStudent);
router.put('/:id', auth(['admin', 'faculty']), updateStudent);
router.get('/:id/attendance', auth(), getStudentAttendance);

module.exports = router;
