// routes/eventRoutes.js
const express = require('express');
const { getEvent, updateEvent } = require('../controllers/eventController');
const { requireOrganizerAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getEvent);
router.put('/', requireOrganizerAuth, updateEvent);

module.exports = router;
