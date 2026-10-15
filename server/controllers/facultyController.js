// controllers/facultyController.js
const Faculty    = require('../models/Faculty');
const Invitation = require('../models/Invitation');

// GET /api/faculty
// Returns all faculty sorted by priority with invitation status embedded
const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ priority: 1, createdAt: 1 });

    const invitations = await Invitation.find({
      faculty: { $in: faculty.map(f => f._id) },
    });
    const invMap = {};
    invitations.forEach(inv => { invMap[inv.faculty.toString()] = inv; });

    const result = faculty.map(f => ({
      ...f.toObject(),
      invitation: invMap[f._id.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    console.error('getFaculty error:', err);
    res.status(500).json({ message: 'Server error fetching faculty.' });
  }
};

// GET /api/faculty/:id  — single faculty record (used by signing page & thank you page)
const getFacultyById = async (req, res) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Faculty member not found.' });

    const invitation = await Invitation.findOne({ faculty: member._id });
    res.json({ ...member.toObject(), invitation: invitation || null });
  } catch (err) {
    console.error('getFacultyById error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid faculty ID format.' });
    res.status(500).json({ message: 'Server error fetching faculty member.' });
  }
};

// POST /api/faculty
// Add a new faculty member — protected by organizer auth
const addFaculty = async (req, res) => {
  try {
    const { name, designation, photo, customMessage, priority } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Faculty name is required.' });
    }

    // Assign priority: if not provided or NaN, place after current max
    let assignPriority = Number(priority);
    if (isNaN(assignPriority) || assignPriority <= 0) {
      const last = await Faculty.findOne().sort({ priority: -1 });
      assignPriority = last ? last.priority + 1 : 1;
    }

    const member = await Faculty.create({
      name:          name.trim(),
      designation:   designation?.trim() || '',
      photo:         photo?.trim() || '',
      customMessage: customMessage?.trim() || '',
      priority:      assignPriority,
    });

    res.status(201).json({ ...member.toObject(), invitation: null });
  } catch (err) {
    console.error('addFaculty error:', err);
    res.status(500).json({ message: 'Server error adding faculty member.' });
  }
};

// PUT /api/faculty/:id
// Edit an existing faculty member's details — protected by organizer auth
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, photo, customMessage, priority } = req.body;

    const member = await Faculty.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Faculty name cannot be empty.' });
      member.name = name.trim();
    }
    if (designation !== undefined)   member.designation   = designation.trim();
    if (photo !== undefined)         member.photo         = photo.trim();
    if (customMessage !== undefined) member.customMessage = customMessage.trim();
    if (priority !== undefined) {
      const p = Number(priority);
      if (!isNaN(p)) member.priority = p;
    }

    const saved = await member.save();
    const invitation = await Invitation.findOne({ faculty: saved._id });

    res.json({
      message: 'Faculty member updated successfully.',
      faculty: { ...saved.toObject(), invitation: invitation || null },
    });
  } catch (err) {
    console.error('updateFaculty error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid faculty ID format.' });
    res.status(500).json({ message: 'Server error updating faculty member.' });
  }
};

// DELETE /api/faculty/:id
// Delete a faculty member and any associated invitation record — protected by organizer auth
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Faculty.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }
    await Invitation.deleteMany({ faculty: id });
    res.json({ message: 'Faculty member deleted successfully.', id });
  } catch (err) {
    console.error('deleteFaculty error:', err);
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid faculty ID format.' });
    res.status(500).json({ message: 'Server error deleting faculty member.' });
  }
};

module.exports = { getFaculty, getFacultyById, addFaculty, updateFaculty, deleteFaculty };
