// models/Faculty.js — Faculty member schema with photo, custom message, and priority
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    designation:   { type: String, trim: true, default: '' },
    photo:         { type: String, default: '' },
    customMessage: { type: String, trim: true, default: '' },
    priority:      { type: Number, default: 999 },
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

facultySchema.index({ priority: 1, createdAt: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
