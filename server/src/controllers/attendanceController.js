const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const Student = require('../models/Student');

exports.markAttendance = async (req, res) => {
  try {
    const { classId, studentId, status } = req.body;

    const classItem = await Class.findById(classId);
    if (!classItem) return res.status(404).json({ msg: 'Class not found' });

    const existingAttendance = await Attendance.findOne({
      studentId,
      classId,
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    if (existingAttendance) {
      return res.status(400).json({ msg: 'Attendance already marked' });
    }

    const attendance = new Attendance({
      studentId,
      classId,
      courseId: classItem.courseId,
      date: new Date(),
      status: status || 'present',
      markedBy: req.user.id,
      method: 'manual'
    });

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const query = { classId: id };
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name studentId email')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { classId, courseId, startDate, endDate } = req.query;

    let match = {};
    if (classId) match.classId = new mongoose.Types.ObjectId(classId);
    if (courseId) match.courseId = new mongoose.Types.ObjectId(courseId);
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const report = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            studentId: '$studentId',
            courseId: '$courseId'
          },
          totalPresent: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          totalLate: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          totalClasses: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id.studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id.courseId',
          foreignField: '_id',
          as: 'course'
        }
      }
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today }
    });

    const attendanceRate = totalStudents > 0 
      ? ((todayAttendance / totalStudents) * 100).toFixed(1) 
      : 0;

    res.json({
      totalStudents,
      todayAttendance,
      attendanceRate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
