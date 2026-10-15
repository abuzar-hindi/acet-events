// routes/organizerRoutes.js
const express = require('express');
const { loginOrganizer, checkAuth } = require('../controllers/organizerController');
const { requireOrganizerAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginOrganizer);
router.get('/check', requireOrganizerAuth, checkAuth);

module.exports = router;
