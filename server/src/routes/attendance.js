const express = require('express');
const router = express.Router();
const { markAttendance, getClassAttendance, updateAttendance, getAttendanceReport, getStats } = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

router.get('/stats', auth(['admin', 'faculty']), getStats);
router.post('/mark', auth(), markAttendance);
router.get('/class/:id', auth(), getClassAttendance);
router.put('/:id', auth(['admin', 'faculty']), updateAttendance);
router.get('/report', auth(['admin', 'faculty']), getAttendanceReport);

module.exports = router;
