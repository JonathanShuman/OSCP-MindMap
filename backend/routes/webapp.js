const express = require('express');
const router = express.Router();
const {
  getChecklistByTarget,
  saveChecklist,
  updateChecklistItem,
  getAllChecklists,
  deleteChecklist
} = require('../controllers/webAppChecklistController');

// GET /api/webapp - Get all checklists (overview)
router.get('/', getAllChecklists);

// GET /api/webapp/:target - Get checklist for specific target
router.get('/:target', getChecklistByTarget);

// POST /api/webapp - Save/update entire checklist
router.post('/', saveChecklist);

// PUT /api/webapp/:target/item - Update specific item in checklist
router.put('/:target/item', updateChecklistItem);

// DELETE /api/webapp/:target - Delete checklist for target
router.delete('/:target', deleteChecklist);

module.exports = router;