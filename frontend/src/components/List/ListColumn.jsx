import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useBoard } from '../../context/BoardContext';
import CardItem from '../Card/CardItem';
import AddCard from '../Card/AddCard';
import './ListColumn.css';

const ListColumn = ({ list, index, cards }) => {
  const { editList, removeList } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleTitleSave = async () => {
    if (title.trim() && title !== list.title) {
      await editList(list.id, title.trim());
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div className="list-column"
          ref={provided.innerRef}
          {...provided.draggableProps}>
          <div className="list-header" {...provided.dragHandleProps}>
            {isEditing ? (
              <input
                className="list-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                autoFocus
              />
            ) : (
              <h3 className="list-title" onClick={() => setIsEditing(true)}>
                {list.title}
              </h3>
            )}
            <button className="list-delete-btn"
              onClick={() => removeList(list.id)}>✕</button>
          </div>

          <Droppable droppableId={`${list.id}`} type="CARD">
            {(provided, snapshot) => (
              <div
                className={`cards-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {cards.map((card, idx) => (
                  <CardItem key={card.id} card={card} index={idx} listId={list.id} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <AddCard listId={list.id} />
        </div>
      )}
    </Draggable>
  );
};

export default ListColumn;