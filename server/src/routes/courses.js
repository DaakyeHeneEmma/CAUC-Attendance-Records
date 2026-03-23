const express = require('express');
const router = express.Router();
const { getCourses, createCourse, getCourse, updateCourse, deleteCourse, getClasses, createClass, getClass, updateClass, deleteClass, seedCourses, addStudentToClass, removeStudentFromClass } = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.post('/courses/seed', seedCourses);
router.get('/courses', auth(), getCourses);
router.post('/courses', auth(['admin', 'faculty']), createCourse);
router.get('/courses/:id', auth(), getCourse);
router.put('/courses/:id', auth(['admin', 'faculty']), updateCourse);
router.delete('/courses/:id', auth(['admin']), deleteCourse);

router.get('/classes', auth(), getClasses);
router.post('/classes', auth(['admin', 'faculty']), createClass);
router.get('/classes/:id', auth(), getClass);
router.put('/classes/:id', auth(['admin', 'faculty']), updateClass);
router.delete('/classes/:id', auth(['admin', 'faculty']), deleteClass);
router.post('/classes/:id/students', auth(['admin', 'faculty']), addStudentToClass);
router.delete('/classes/:id/students/:studentId', auth(['admin', 'faculty']), removeStudentFromClass);

module.exports = router;
