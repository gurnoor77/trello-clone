const express = require('express');
const router  = express.Router();
const {
  getCardsByList,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} = require('../controllers/cardController');

router.get('/list/:listId', getCardsByList);
router.get('/:id',          getCardById);
router.post('/',            createCard);
router.put('/:id',          updateCard);
router.delete('/:id',       deleteCard);
router.put('/:id/move',     moveCard);

module.exports = router;