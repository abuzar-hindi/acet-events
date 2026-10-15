// controllers/organizerController.js
const { generateOrganizerToken, verifyOrganizerToken } = require('../middleware/auth');

// POST /api/organizer/login
// Verifies organizer password and returns a signed 24h session token
const loginOrganizer = (req, res) => {
  try {
    const { password } = req.body;
    const correctPassword = process.env.ADD_MEMBER_PASSWORD || 'acet_ca_26';

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    if (password !== correctPassword) {
      return res.status(401).json({ message: 'Incorrect organizer password. Access denied.' });
    }

    // Issue signed session token
    const token = generateOrganizerToken(correctPassword);
    res.json({
      success: true,
      message: 'Organizer authentication successful.',
      token,
      expiresIn: 86400, // 24 hours
    });
  } catch (err) {
    console.error('loginOrganizer error:', err);
    res.status(500).json({ message: 'Server error during organizer authentication.' });
  }
};

// GET /api/organizer/check
// Validates an existing session token
const checkAuth = (req, res) => {
  // If request reached here through requireOrganizerAuth, token is valid
  res.json({ success: true, authenticated: true });
};

module.exports = { loginOrganizer, checkAuth };
