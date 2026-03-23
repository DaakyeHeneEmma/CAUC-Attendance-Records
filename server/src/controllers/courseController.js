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
    const query = req.user.role === 'faculty' ? { facultyId: req.user.id } : {};
    const classes = await Class.find(query).populate('courseId').populate('facultyId', 'name');
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
