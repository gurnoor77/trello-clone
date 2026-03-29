const express = require('express');
const router  = express.Router();
const {
  getAllMembers,
  addMemberToCard,
  removeMemberFromCard,
} = require('../controllers/memberController');

router.get('/',                           getAllMembers);
router.post('/card/:cardId',              addMemberToCard);
router.delete('/card/:cardId/:memberId',  removeMemberFromCard);

module.exports = router;