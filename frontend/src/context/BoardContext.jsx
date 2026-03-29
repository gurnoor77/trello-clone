import { createContext, useContext, useState, useEffect } from 'react';
import * as boardService from '../services/boardService';

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards]   = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [lists, setLists]     = useState([]);
  const [cards, setCards]     = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBoards();
    fetchMembers();
  }, []);

  const fetchBoards = async () => {
    const res = await boardService.getBoards();
    setBoards(res.data);
  };

  const fetchMembers = async () => {
    const res = await boardService.getMembers();
    setMembers(res.data);
  };

  const fetchBoard = async (id) => {
    setLoading(true);
    const boardRes = await boardService.getBoardById(id);
    setCurrentBoard(boardRes.data);
    const listsRes = await boardService.getListsByBoard(id);
    const fetchedLists = listsRes.data;
    setLists(fetchedLists);
    const cardsMap = {};
for (const list of fetchedLists) {
  const cardsRes = await boardService.getCardsByList(list.id);
  const cardsWithDetails = await Promise.all(
    cardsRes.data.map(async (card) => {
      const detailRes = await boardService.getCardById(card.id);
      return detailRes.data;
    })
  );
  cardsMap[list.id] = cardsWithDetails;
}
    setCards(cardsMap);
    setLoading(false);
  };

  const addBoard = async (title, background) => {
    const res = await boardService.createBoard({ title, background });
    setBoards([...boards, res.data]);
    return res.data;
  };

  const addList = async (boardId, title) => {
    const position = lists.length + 1;
    const res = await boardService.createList({ board_id: boardId, title, position });
    setLists([...lists, res.data]);
    setCards({ ...cards, [res.data.id]: [] });
  };

  const editList = async (id, title) => {
    await boardService.updateList(id, { title });
    setLists(lists.map(l => l.id === id ? { ...l, title } : l));
  };

  const removeList = async (id) => {
    await boardService.deleteList(id);
    setLists(lists.filter(l => l.id !== id));
    const newCards = { ...cards };
    delete newCards[id];
    setCards(newCards);
  };

  const addCard = async (listId, title) => {
    const position = (cards[listId]?.length || 0) + 1;
    const res = await boardService.createCard({ list_id: listId, title, position });
    setCards({ ...cards, [listId]: [...(cards[listId] || []), res.data] });
  };

  const removeCard = async (listId, cardId) => {
    await boardService.deleteCard(cardId);
    setCards({ ...cards, [listId]: cards[listId].filter(c => c.id !== cardId) });
  };

  const moveCardBetweenLists = async (cardId, fromListId, toListId, position) => {
    await boardService.moveCard(cardId, { list_id: toListId, position });
    const card = cards[fromListId].find(c => c.id === cardId);
    const newFrom = cards[fromListId].filter(c => c.id !== cardId);
    const newTo   = [...(cards[toListId] || []), { ...card, list_id: toListId }];
    setCards({ ...cards, [fromListId]: newFrom, [toListId]: newTo });
  };

  return (
    <BoardContext.Provider value={{
      boards, currentBoard, lists, cards, members, loading,
      fetchBoard, addBoard, addList, editList, removeList,
      addCard, removeCard, moveCardBetweenLists,
      setLists, setCards,
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);