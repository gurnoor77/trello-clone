const express = require('express');
const router  = express.Router();
const {
  getListsByBoard,
  createList,
  updateList,
  deleteList,
  reorderLists,
} = require('../controllers/listController');

router.get('/board/:boardId', getListsByBoard);
router.post('/',              createList);
router.put('/:id',            updateList);
router.delete('/:id',         deleteList);
router.put('/reorder',        reorderLists);

module.exports = router;