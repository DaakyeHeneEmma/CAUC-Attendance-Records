const Course = require('../models/Course');
const Class = require('../models/Class');

const defaultCourses = [
  { code: 'FA101', name: 'Financial Accounting' },
  { code: 'ETH101', name: 'Ethics' },
  { code: 'CF101', name: 'Computer Fundamentals' },
  { code: 'CS101', name: 'Comm Skills' },
  { code: 'IT101', name: 'Information Technology' }
];

exports.seedCourses = async (req, res) => {
  try {
    const existing = await Course.countDocuments();
    if (existing > 0) {
      return res.json({ msg: 'Courses already seeded', count: existing });
    }
    const courses = await Course.insertMany(defaultCourses);
    res.json({ msg: 'Courses seeded successfully', count: courses.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('facultyId', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = new Course({ ...req.body, facultyId: req.user.id });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('facultyId');
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'faculty') {
      query.facultyId = req.user.id;
    } else if (req.user.role === 'student') {
      const Student = require('../models/Student');
      const student = await Student.findOne({ userId: req.user.id });
      if (student) {
        query.facultyId = student.facultyId;
      }
    }
    
    const classes = await Class.find(query)
      .populate('courseId')
      .populate('facultyId', 'name')
      .populate('students', 'name studentId email');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classItem = new Class({ ...req.body, facultyId: req.user.id });
    await classItem.save();
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('courseId').populate('facultyId', 'name');
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.body;
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ msg: 'Class not found' });
    
    if (classItem.students.includes(studentId)) {
      return res.status(400).json({ msg: 'Student already in class' });
    }
    
    classItem.students.push(studentId);
    await classItem.save();
    const populatedClass = await Class.findById(req.params.id)
      .populate('courseId')
      .populate('facultyId', 'name')
      .populate('students', 'name studentId email');
    res.json(populatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const { studentId } = req.params;
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ msg: 'Class not found' });
    
    classItem.students = classItem.students.filter(s => s.toString() !== studentId);
    await classItem.save();
    const populatedClass = await Class.findById(req.params.id)
      .populate('courseId')
      .populate('facultyId', 'name')
      .populate('students', 'name studentId email');
    res.json(populatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
