const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  semester: { type: Number },
  academicYear: { type: String },
  createdAt: { type: Date, default: Date.now }
});

enrollmentSchema.index({ studentId: 1, classId: 1, semester: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
