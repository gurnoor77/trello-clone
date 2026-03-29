import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BoardProvider, useBoard } from './context/BoardContext';
import BoardView from './components/Board/BoardView';
import './App.css';

const COLORS = [
  '#0079bf', '#d29034', '#519839', '#b04632',
  '#89609e', '#cd5a91', '#4bbf6b', '#00aecc',
];

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <span>T</span>Trello
      </div>
    </nav>
  );
};

const CreateBoardModal = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), color);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={e => e.stopPropagation()}>
        <div className="create-modal-preview" style={{ background: color }}>
          <span>{title || 'Board title'}</span>
        </div>
        <input
          className="create-modal-input"
          placeholder="Add board title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <p className="create-modal-label">Background</p>
        <div className="color-grid">
          {COLORS.map(c => (
            <div
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <button
          className="create-modal-btn"
          onClick={handleSubmit}
          disabled={!title.trim()}>
          Create
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const { boards, addBoard } = useBoard();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (title, color) => {
    const board = await addBoard(title, color);
    navigate(`/board/${board.id}`);
  };

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <div className="home-section-title">★ Your boards</div>
        <div className="boards-grid">
          {boards.map((board, i) => (
            <div
              key={board.id}
              className="board-card"
              style={{ background: board.background || COLORS[i % COLORS.length] }}
              onClick={() => navigate(`/board/${board.id}`)}>
              <h3>{board.title}</h3>
            </div>
          ))}
          <div className="create-board-card" onClick={() => setShowModal(true)}>
            + Create new board
          </div>
        </div>
      </div>
      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <BoardProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:id" element={<BoardView />} />
        </Routes>
      </BoardProvider>
    </BrowserRouter>
  );
};

export default App;