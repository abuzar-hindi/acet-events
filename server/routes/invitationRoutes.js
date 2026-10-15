// routes/invitationRoutes.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { signInvitation, getStats } = require('../controllers/invitationController');

// ── Multer setup: store signatures to disk ────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'signatures');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are accepted.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
});

const router = express.Router();

router.get('/stats', getStats);
router.post('/sign', upload.single('signature'), signInvitation);

module.exports = router;
