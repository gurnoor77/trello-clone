const pool = require('../db/connection');

const getCardsByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const result = await pool.query(
      'SELECT * FROM cards WHERE list_id = $1 AND archived = FALSE ORDER BY position ASC',
      [listId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await pool.query('SELECT * FROM cards WHERE id = $1', [id]);
    if (card.rows.length === 0) return res.status(404).json({ error: 'Card not found' });

    const labels  = await pool.query(
      'SELECT l.* FROM labels l JOIN card_labels cl ON l.id = cl.label_id WHERE cl.card_id = $1', [id]
    );
    const members = await pool.query(
      'SELECT m.* FROM members m JOIN card_members cm ON m.id = cm.member_id WHERE cm.card_id = $1', [id]
    );
    const checklists = await pool.query(
      'SELECT * FROM checklists WHERE card_id = $1', [id]
    );
    for (const checklist of checklists.rows) {
      const items = await pool.query(
        'SELECT * FROM checklist_items WHERE checklist_id = $1', [checklist.id]
      );
      checklist.items = items.rows;
    }

    res.json({
      ...card.rows[0],
      labels:     labels.rows,
      members:    members.rows,
      checklists: checklists.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { list_id, title, description, position } = req.body;
    const result = await pool.query(
      'INSERT INTO cards (list_id, title, description, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [list_id, title, description || '', position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, archived } = req.body;
    const result = await pool.query(
      'UPDATE cards SET title=$1, description=$2, due_date=$3, archived=$4 WHERE id=$5 RETURNING *',
      [title, description, due_date, archived, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { list_id, position } = req.body;
    const result = await pool.query(
      'UPDATE cards SET list_id=$1, position=$2 WHERE id=$3 RETURNING *',
      [list_id, position, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCardsByList, getCardById, createCard, updateCard, deleteCard, moveCard };