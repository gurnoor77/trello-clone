import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BoardProvider, useBoard } from './context/BoardContext';
import BoardView from './components/Board/BoardView';
import './App.css';

const Home = () => {
  const { boards, addBoard } = useBoard();
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    const title = prompt('Enter board title:');
    if (!title) return;
    const board = await addBoard(title);
    navigate(`/board/${board.id}`);
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>My Boards</h1>
        <button className="create-board-btn" onClick={handleCreateBoard}>
          + Create Board
        </button>
      </div>
      <div className="boards-grid">
        {boards.map(board => (
          <div key={board.id} className="board-card"
            style={{ background: board.background }}
            onClick={() => navigate(`/board/${board.id}`)}>
            <h3>{board.title}</h3>
          </div>
        ))}
      </div>
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