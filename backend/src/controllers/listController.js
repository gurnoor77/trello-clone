const pool = require('../db/connection');

const getListsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const result = await pool.query(
      'SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createList = async (req, res) => {
  try {
    const { board_id, title, position } = req.body;
    const result = await pool.query(
      'INSERT INTO lists (board_id, title, position) VALUES ($1, $2, $3) RETURNING *',
      [board_id, title, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const result = await pool.query(
      'UPDATE lists SET title = $1 WHERE id = $2 RETURNING *',
      [title, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM lists WHERE id = $1', [id]);
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reorderLists = async (req, res) => {
  try {
    const { lists } = req.body;
    for (const list of lists) {
      await pool.query('UPDATE lists SET position = $1 WHERE id = $2', [list.position, list.id]);
    }
    res.json({ message: 'Lists reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getListsByBoard, createList, updateList, deleteList, reorderLists };