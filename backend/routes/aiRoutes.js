const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateSummary, improveDescription, suggestSkills } = require('../controllers/aiController');

// POST /api/ai/generate-summary
router.post('/generate-summary', auth, generateSummary);

// POST /api/ai/improve-description
router.post('/improve-description', auth, improveDescription);

// POST /api/ai/suggest-skills
router.post('/suggest-skills', auth, suggestSkills);

module.exports = router;
