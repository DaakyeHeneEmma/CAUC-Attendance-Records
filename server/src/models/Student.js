const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  level: { type: Number },
  semester: { type: Number },
  academicYear: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
