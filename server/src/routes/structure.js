const express = require('express');
const router = express.Router();
const {
  getUniversity,
  createUniversity,
  getFaculties,
  createFaculty,
  getDepartments,
  createDepartment,
  getPrograms,
  createProgram,
  getCourses,
  createCourse,
  getClasses,
  createClass,
  getStudents,
  createStudent,
  enrollStudent,
  unenrollStudent,
  getEnrollments,
  seedData
} = require('../controllers/structureController');
const auth = require('../middleware/auth');

router.post('/seed', auth(['admin']), seedData);

router.get('/university', getUniversity);
router.post('/university', auth(['admin']), createUniversity);

router.get('/faculties', auth(), getFaculties);
router.post('/faculties', auth(['admin']), createFaculty);

router.get('/departments', auth(), getDepartments);
router.post('/departments', auth(['admin']), createDepartment);

router.get('/programs', auth(), getPrograms);
router.post('/programs', auth(['admin']), createProgram);

router.get('/courses', auth(), getCourses);
router.post('/courses', auth(['admin', 'lecturer']), createCourse);

router.get('/classes', auth(), getClasses);
router.post('/classes', auth(['admin', 'lecturer']), createClass);

router.get('/students', auth(), getStudents);
router.post('/students', auth(['admin']), createStudent);

router.post('/enroll', auth(['admin', 'lecturer']), enrollStudent);
router.delete('/enroll/:studentId/:classId', auth(['admin', 'lecturer']), unenrollStudent);
router.get('/enrollments', auth(), getEnrollments);

module.exports = router;
