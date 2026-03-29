import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import './AddCard.css';

const AddCard = ({ listId }) => {
  const { addCard } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle]       = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await addCard(listId, title.trim());
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) return (
    <div className="add-card-btn" onClick={() => setIsAdding(true)}>
      + Add a card
    </div>
  );

  return (
    <div className="add-card-form">
      <textarea
        className="add-card-input"
        placeholder="Enter a title for this card..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
        autoFocus
        rows={3}
      />
      <div className="add-card-actions">
        <button className="add-btn" onClick={handleSubmit}>Add card</button>
        <button className="cancel-btn" onClick={() => setIsAdding(false)}>✕</button>
      </div>
    </div>
  );
};

export default AddCard;