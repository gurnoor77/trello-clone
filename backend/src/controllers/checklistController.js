const pool = require('../db/connection');

const createChecklist = async (req, res) => {
  try {
    const { card_id, title } = req.body;
    const result = await pool.query(
      'INSERT INTO checklists (card_id, title) VALUES ($1, $2) RETURNING *',
      [card_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createChecklistItem = async (req, res) => {
  try {
    const { checklist_id, text } = req.body;
    const result = await pool.query(
      'INSERT INTO checklist_items (checklist_id, text) VALUES ($1, $2) RETURNING *',
      [checklist_id, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_done } = req.body;
    const result = await pool.query(
      'UPDATE checklist_items SET is_done = $1 WHERE id = $2 RETURNING *',
      [is_done, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createChecklist, createChecklistItem, updateChecklistItem };