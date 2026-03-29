import './BoardHeader.css';

const BoardHeader = ({ board }) => {
  return (
    <div className="board-header">
      <h1 className="board-title">{board.title}</h1>
    </div>
  );
};

export default BoardHeader;