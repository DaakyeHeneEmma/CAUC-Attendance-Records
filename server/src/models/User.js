const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'lecturer', 'student'], default: 'student' },
  staffId: { type: String },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
