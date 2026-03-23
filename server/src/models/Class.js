const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lecture', 'tutorial', 'lab'], default: 'lecture' },
  semester: { type: Number },
  academicYear: { type: String },
  schedule: {
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String },
    endTime: { type: String }
  },
  location: { type: String },
  maxStudents: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);
