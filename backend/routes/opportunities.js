const express = require('express');
const {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    applyToOpportunity
} = require('../controllers/opportunityController');
const { auth, adminOnly, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getOpportunities);
router.get('/:id', getOpportunity);
router.post('/:id/apply', applyToOpportunity);

// Protected routes
router.post('/', auth, editorOrAdmin, createOpportunity);
router.put('/:id', auth, editorOrAdmin, updateOpportunity);
router.delete('/:id', auth, adminOnly, deleteOpportunity);

module.exports = router;