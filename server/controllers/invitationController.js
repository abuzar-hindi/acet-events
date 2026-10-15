// controllers/invitationController.js
const path       = require('path');
const fs         = require('fs');
const mongoose   = require('mongoose');
const Faculty    = require('../models/Faculty');
const Invitation = require('../models/Invitation');

// POST /api/invitations/sign
// Accepts multipart/form-data with facultyId + signature file
const signInvitation = async (req, res) => {
  try {
    const { facultyId, signatureData: incomingSignatureData } = req.body;

    if (!facultyId) {
      return res.status(400).json({ message: 'facultyId is required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ message: 'Invalid faculty ID format.' });
    }

    // Verify faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }

    // Prevent duplicate signatures — check at backend level
    const existing = await Invitation.findOne({ faculty: facultyId });
    if (existing && existing.status === 'signed') {
      return res.status(409).json({
        message: `${faculty.name} has already signed their invitation.`,
      });
    }

    if (!req.file && !incomingSignatureData) {
      return res.status(400).json({ message: 'Signature image is required.' });
    }

    // Build relative path for storage reference
    const signatureFile = req.file ? `uploads/signatures/${req.file.filename}` : (existing?.signatureFile || null);

    // Build base64 signature data backup
    let signatureData = incomingSignatureData || null;
    if (!signatureData && req.file && req.file.path) {
      try {
        const fileBuf = fs.readFileSync(req.file.path);
        signatureData = `data:${req.file.mimetype || 'image/png'};base64,${fileBuf.toString('base64')}`;
      } catch (readErr) {
        console.warn('Could not read uploaded signature file for base64 backup:', readErr);
      }
    }

    let invitation;
    if (existing) {
      // Update pending → signed
      existing.status        = 'signed';
      existing.signatureFile = signatureFile;
      if (signatureData) existing.signatureData = signatureData;
      existing.signedAt      = new Date();
      invitation = await existing.save();
    } else {
      // Create new signed invitation
      invitation = await Invitation.create({
        faculty:       facultyId,
        status:        'signed',
        signatureFile,
        signatureData,
        signedAt:      new Date(),
      });
    }

    // Return the updated faculty with invitation embedded
    const updatedFaculty = {
      ...faculty.toObject(),
      invitation: invitation.toObject(),
    };

    res.json({
      message: 'Signature saved successfully.',
      faculty: updatedFaculty,
      signatureFile,
    });
  } catch (err) {
    console.error('signInvitation error:', err);
    // Handle unique constraint violation (concurrency race condition)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This faculty member has already signed.' });
    }
    res.status(500).json({ message: 'Server error saving signature.' });
  }
};

// GET /api/invitations/stats
// Returns signing statistics from actual DB records
const getStats = async (req, res) => {
  try {
    const total  = await Faculty.countDocuments();
    const signed = await Invitation.countDocuments({ status: 'signed' });
    const pending = Math.max(0, total - signed);
    const percentage = total > 0 ? Math.round((signed / total) * 100) : 0;

    res.json({ total, signed, pending, percentage });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
};

module.exports = { signInvitation, getStats };
