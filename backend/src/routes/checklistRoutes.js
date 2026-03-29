const express = require('express');
const router  = express.Router();
const {
  createChecklist,
  createChecklistItem,
  updateChecklistItem,
} = require('../controllers/checklistController');

router.post('/',                  createChecklist);
router.post('/items',             createChecklistItem);
router.put('/items/:id',          updateChecklistItem);

module.exports = router;