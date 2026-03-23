const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'excused'], 
    default: 'present' 
  },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  method: { type: String, enum: ['manual', 'qr', 'face', 'geofence'], default: 'manual' },
  location: {
    latitude: Number,
    longitude: Number
  },
  createdAt: { type: Date, default: Date.now }
});

attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
