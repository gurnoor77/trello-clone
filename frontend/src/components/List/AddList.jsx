import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import './AddList.css';

const AddList = ({ boardId }) => {
  const { addList } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle]       = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await addList(boardId, title.trim());
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) return (
    <div className="add-list-btn" onClick={() => setIsAdding(true)}>
      + Add another list
    </div>
  );

  return (
    <div className="add-list-form">
      <input
        className="add-list-input"
        placeholder="Enter list title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        autoFocus
      />
      <div className="add-list-actions">
        <button className="add-btn" onClick={handleSubmit}>Add list</button>
        <button className="cancel-btn" onClick={() => setIsAdding(false)}>✕</button>
      </div>
    </div>
  );
};

export default AddList;