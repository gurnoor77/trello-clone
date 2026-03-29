import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BoardProvider, useBoard } from './context/BoardContext';
import BoardView from './components/Board/BoardView';
import './App.css';

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

const Home = () => {
  const { boards, addBoard } = useBoard();
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    const title = prompt('Enter board title:');
    if (!title) return;
    const board = await addBoard(title);
    navigate(`/board/${board.id}`);
  };

  const COLORS = [
    '#0079bf','#d29034','#519839','#b04632',
    '#89609e','#cd5a91','#4bbf6b','#00aecc',
  ];

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <div className="home-section-title">
          ★ Your boards
        </div>
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
          <div className="create-board-card" onClick={handleCreateBoard}>
            + Create new board
          </div>
        </div>
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