const pool = require('../db/connection');

const getAllBoards = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boards ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM boards WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Board not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBoard = async (req, res) => {
  try {
    const { title, background } = req.body;
    const result = await pool.query(
      'INSERT INTO boards (title, background) VALUES ($1, $2) RETURNING *',
      [title, background || '#0079bf']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, background } = req.body;
    const result = await pool.query(
      'UPDATE boards SET title = $1, background = $2 WHERE id = $3 RETURNING *',
      [title, background, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM boards WHERE id = $1', [id]);
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBoards, getBoardById, createBoard, updateBoard, deleteBoard };