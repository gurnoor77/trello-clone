import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBoard } from '../../context/BoardContext';
import ListColumn from '../List/ListColumn';
import AddList from '../List/AddList';
import BoardHeader from './BoardHeader';
import SearchBar from '../UI/SearchBar';
import './BoardView.css';

const BoardView = () => {
  const { id } = useParams();
  const { currentBoard, lists, cards, loading, fetchBoard,
          moveCardBetweenLists, setLists, setCards, members } = useBoard();

  const [search, setSearch]             = useState('');
  const [filterLabel, setFilterLabel]   = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [filterDue, setFilterDue]       = useState('');

  useEffect(() => {
    fetchBoard(id);
  }, [id]);

  const filterCards = (listCards) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekLater = new Date(today);
    weekLater.setDate(today.getDate() + 7);

    return listCards.filter(card => {
      const matchSearch = search
        ? card.title.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchLabel = filterLabel
        ? card.labels?.some(l => l.color === filterLabel)
        : true;

      const matchMember = filterMember
        ? card.members?.some(m => m.id === parseInt(filterMember))
        : true;

      const matchDue = (() => {
        if (!filterDue) return true;
        if (filterDue === 'no_due') return !card.due_date;
        if (!card.due_date) return false;
        const due = new Date(card.due_date);
        due.setHours(0, 0, 0, 0);
        if (filterDue === 'overdue')   return due < today;
        if (filterDue === 'due_today') return due.getTime() === today.getTime();
        if (filterDue === 'due_week')  return due >= today && due <= weekLater;
        return true;
      })();

      return matchSearch && matchLabel && matchMember && matchDue;
    });
  };

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
      <SearchBar
        search={search} setSearch={setSearch}
        filterLabel={filterLabel} setFilterLabel={setFilterLabel}
        filterMember={filterMember} setFilterMember={setFilterMember}
        filterDue={filterDue} setFilterDue={setFilterDue}
        members={members}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div className="lists-container"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {lists.map((list, index) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  index={index}
                  cards={filterCards(cards[list.id] || [])}
                />
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