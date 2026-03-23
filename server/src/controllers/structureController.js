const mongoose = require('mongoose');
const University = require('../models/University');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Program = require('../models/Program');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

exports.getUniversity = async (req, res) => {
  try {
    const university = await University.findOne();
    res.json(university);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUniversity = async (req, res) => {
  try {
    const university = new University(req.body);
    await university.save();
    res.json(university);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate('universityId', 'name code')
      .populate('dean', 'name email');
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const { facultyId } = req.query;
    const query = facultyId ? { facultyId } : {};
    const departments = await Department.find(query)
      .populate('facultyId', 'name code')
      .populate('hod', 'name email');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrograms = async (req, res) => {
  try {
    const { departmentId } = req.query;
    const query = departmentId ? { departmentId } : {};
    const programs = await Program.find(query)
      .populate('departmentId', 'name code')
      .populate({
        path: 'departmentId',
        populate: { path: 'facultyId', select: 'name code' }
      });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { programId } = req.query;
    const query = programId ? { programId } : {};
    const courses = await Course.find(query)
      .populate('programId', 'name code level');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    let query = {};
    const { programId, courseId, semester, academicYear } = req.query;
    
    if (programId) {
      const courses = await Course.find({ programId }).select('_id');
      query.courseId = { $in: courses.map(c => c._id) };
    }
    if (courseId) query.courseId = courseId;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    if (req.user.role === 'lecturer') {
      query.lecturerId = req.user.id;
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (student) {
        const enrollments = await Enrollment.find({ 
          studentId: student._id,
          semester: student.semester,
          academicYear: student.academicYear
        }).select('classId');
        query._id = { $in: enrollments.map(e => e.classId) };
      }
    }

    const classes = await Class.find(query)
      .populate('courseId', 'name code credits')
      .populate('lecturerId', 'name email')
      .populate({
        path: 'courseId',
        populate: { path: 'programId', select: 'name code level' }
      });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classItem = new Class({ ...req.body, lecturerId: req.user.id });
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    let query = {};
    const { programId, level, semester } = req.query;
    
    if (programId) query.programId = programId;
    if (level) query.level = level;
    if (semester) query.semester = semester;

    const students = await Student.find(query)
      .populate('programId', 'name code level')
      .populate({
        path: 'programId',
        populate: { 
          path: 'departmentId',
          populate: { path: 'facultyId', select: 'name code' }
        }
      });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, classId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const existing = await Enrollment.findOne({
      studentId,
      classId,
      semester: student.semester,
      academicYear: student.academicYear
    });
    
    if (existing) return res.status(400).json({ msg: 'Student already enrolled' });

    const enrollment = new Enrollment({
      studentId,
      classId,
      semester: student.semester,
      academicYear: student.academicYear
    });
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unenrollStudent = async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    await Enrollment.findOneAndDelete({ studentId, classId });
    res.json({ msg: 'Student unenrolled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const { classId } = req.query;
    const query = classId ? { classId } : {};
    
    const enrollments = await Enrollment.find(query)
      .populate('studentId', 'name studentId email')
      .populate({
        path: 'classId',
        populate: { 
          path: 'courseId',
          select: 'name code'
        }
      });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seedData = async (req, res) => {
  try {
    const existingUniversity = await University.findOne();
    if (existingUniversity) {
      return res.json({ msg: 'Data already seeded', university: existingUniversity });
    }

    const university = new University({
      name: 'CAUC University',
      code: 'CAUC'
    });
    await university.save();

    const faculty = new Faculty({
      name: 'Faculty of Computer Science',
      code: 'FCS',
      universityId: university._id
    });
    await faculty.save();

    const department = new Department({
      name: 'Computer Science',
      code: 'CS',
      facultyId: faculty._id
    });
    await department.save();

    const program = new Program({
      name: 'BSc Computer Science',
      code: 'CS-BSC',
      departmentId: department._id,
      level: 'Degree',
      duration: 4
    },
    {
      name: 'BSc Information Technology',
      code: 'CS-ICT',
      departmentId: department._id,
      level: 'Degree',
      duration: 4
    });
    await program.save();

    const courses = [
      { code: 'CS101', name: 'Introduction to Programming', credits: 3, programId: program._id, semester: 1 },
      { code: 'CS102', name: 'Data Structures', credits: 4, programId: program._id, semester: 2 },
      { code: 'MTH101', name: 'Calculus I', credits: 3, programId: program._id, semester: 1 },
      { code: 'ENG101', name: 'Technical Writing', credits: 2, programId: program._id, semester: 1 },
      { code: 'PHY101', name: 'Physics for Computing', credits: 3, programId: program._id, semester: 1 }
    ];
    await Course.insertMany(courses);

    res.json({ 
      msg: 'Data seeded successfully',
      university,
      faculty,
      department,
      program,
      courses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
