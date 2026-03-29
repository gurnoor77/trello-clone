const pool = require('../db/connection');

const addLabelToCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { color, name } = req.body;
    const label = await pool.query(
      'INSERT INTO labels (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    );
    await pool.query(
      'INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [cardId, label.rows[0].id]
    );
    res.status(201).json(label.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeLabelFromCard = async (req, res) => {
  try {
    const { cardId, labelId } = req.params;
    await pool.query(
      'DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2',
      [cardId, labelId]
    );
    res.json({ message: 'Label removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addLabelToCard, removeLabelFromCard };