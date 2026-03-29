const express = require('express');
const router  = express.Router();
const {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');

router.get('/',     getAllBoards);
router.get('/:id',  getBoardById);
router.post('/',    createBoard);
router.put('/:id',  updateBoard);
router.delete('/:id', deleteBoard);

module.exports = router;