import { useNavigate } from 'react-router-dom';
import './BoardHeader.css';

const BoardHeader = ({ board }) => {
  const navigate = useNavigate();
  return (
    <div className="board-header">
      <div className="board-header-left">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span>T</span>Trello
        </div>
        <div className="header-divider" />
        <h1 className="board-title">{board.title}</h1>
      </div>
    </div>
  );
};

export default BoardHeader;