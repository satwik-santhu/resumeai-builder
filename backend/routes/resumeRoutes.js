const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createResume,
  getAllResumes,
  getResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');

// All resume routes are protected by JWT auth middleware

// POST /api/resume/create
router.post('/create', auth, createResume);

// GET /api/resume  (all resumes for user)
router.get('/', auth, getAllResumes);

// GET /api/resume/:id
router.get('/:id', auth, getResume);

// PUT /api/resume/:id
router.put('/:id', auth, updateResume);

// DELETE /api/resume/:id
router.delete('/:id', auth, deleteResume);

module.exports = router;
