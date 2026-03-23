const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  level: { type: String, enum: ['HND', 'Degree', 'Masters', 'PhD'] },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

programSchema.index({ departmentId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Program', programSchema);
