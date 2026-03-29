const pool = require('../db/connection');

const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMemberToCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { member_id } = req.body;
    await pool.query(
      'INSERT INTO card_members (card_id, member_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [cardId, member_id]
    );
    res.status(201).json({ message: 'Member added to card' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeMemberFromCard = async (req, res) => {
  try {
    const { cardId, memberId } = req.params;
    await pool.query(
      'DELETE FROM card_members WHERE card_id = $1 AND member_id = $2',
      [cardId, memberId]
    );
    res.json({ message: 'Member removed from card' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMembers, addMemberToCard, removeMemberFromCard };