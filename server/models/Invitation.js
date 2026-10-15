// models/Invitation.js
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      unique: true,   // ONE invitation per faculty — enforced at DB level
    },
    status: {
      type: String,
      enum: ['pending', 'signed'],
      default: 'pending',
    },
    // Path to the saved signature file (e.g. "uploads/signatures/abc123.png")
    signatureFile: { type: String, default: null },
    // Full base64 dataURL backup directly stored in MongoDB
    signatureData: { type: String, default: null },
    signedAt:      { type: Date,   default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invitation', invitationSchema);
