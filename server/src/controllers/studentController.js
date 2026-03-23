const Student = require('../models/Student');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courseId').populate('classId');
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

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courseId').populate('classId');
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.id })
      .populate('classId')
      .populate('courseId')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
