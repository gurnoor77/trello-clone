import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBoard } from '../../context/BoardContext';
import ListColumn from '../List/ListColumn';
import AddList from '../List/AddList';
import BoardHeader from './BoardHeader';
import './BoardView.css';

const BoardView = () => {
  const { id } = useParams();
  const { currentBoard, lists, cards, loading, fetchBoard,
          moveCardBetweenLists, setLists, setCards } = useBoard();

  useEffect(() => {
    fetchBoard(id);
  }, [id]);

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId &&
        source.index === destination.index) return;

    if (type === 'LIST') {
      const newLists = Array.from(lists);
      const [moved] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, moved);
      setLists(newLists);
      return;
    }

    const sourceListId = parseInt(source.droppableId);
    const destListId   = parseInt(destination.droppableId);
    const sourceCards  = Array.from(cards[sourceListId] || []);
    const [movedCard]  = sourceCards.splice(source.index, 1);

    if (sourceListId === destListId) {
      sourceCards.splice(destination.index, 0, movedCard);
      setCards({ ...cards, [sourceListId]: sourceCards });
    } else {
      const destCards = Array.from(cards[destListId] || []);
      destCards.splice(destination.index, 0, movedCard);
      setCards({ ...cards, [sourceListId]: sourceCards, [destListId]: destCards });
      await moveCardBetweenLists(movedCard.id, sourceListId, destListId, destination.index + 1);
    }
  };

  if (loading) return <div className="loading">Loading board...</div>;
  if (!currentBoard) return null;

  return (
    <div className="board-view" style={{ background: currentBoard.background }}>
      <BoardHeader board={currentBoard} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div className="lists-container"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {lists.map((list, index) => (
                <ListColumn key={list.id} list={list} index={index}
                  cards={cards[list.id] || []} />
              ))}
              {provided.placeholder}
              <AddList boardId={parseInt(id)} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BoardView;