const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  credits: { type: Number, default: 3 },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  semester: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

courseSchema.index({ programId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
