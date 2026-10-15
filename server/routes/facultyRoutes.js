// routes/facultyRoutes.js
const express = require('express');
const {
  getFaculty,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { requireOrganizerAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/',        getFaculty);
router.get('/:id',     getFacultyById);
router.post('/',       requireOrganizerAuth, addFaculty);
router.put('/:id',     requireOrganizerAuth, updateFaculty);
router.delete('/:id',  requireOrganizerAuth, deleteFaculty);

module.exports = router;
