const express = require('express');
const router  = express.Router();
const {
  addLabelToCard,
  removeLabelFromCard,
} = require('../controllers/labelController');

router.post('/card/:cardId',           addLabelToCard);
router.delete('/card/:cardId/:labelId', removeLabelFromCard);

module.exports = router;