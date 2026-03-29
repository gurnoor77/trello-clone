import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import CardModal from './CardModal';
import './CardItem.css';

const CardItem = ({ card, index, listId }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Draggable draggableId={`card-${card.id}`} index={index}>
        {(provided, snapshot) => (
          <div
            className={`card-item ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowModal(true)}>
            {card.due_date && (
              <div className="card-due-date">
                📅 {new Date(card.due_date).toLocaleDateString()}
              </div>
            )}
            <p className="card-title">{card.title}</p>
          </div>
        )}
      </Draggable>
      {showModal && (
        <CardModal
          card={card}
          listId={listId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CardItem;