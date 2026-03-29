import api from './api';

export { default as api } from './api';

export const getBoards    = ()           => api.get('/boards');
export const getBoardById = (id)         => api.get(`/boards/${id}`);
export const createBoard  = (data)       => api.post('/boards', data);
export const updateBoard  = (id, data)   => api.put(`/boards/${id}`, data);
export const deleteBoard  = (id)         => api.delete(`/boards/${id}`);

export const getListsByBoard = (boardId) => api.get(`/lists/board/${boardId}`);
export const createList      = (data)    => api.post('/lists', data);
export const updateList      = (id, data)=> api.put(`/lists/${id}`, data);
export const deleteList      = (id)      => api.delete(`/lists/${id}`);
export const reorderLists    = (lists)   => api.put('/lists/reorder', { lists });

export const getCardsByList  = (listId)  => api.get(`/cards/list/${listId}`);
export const getCardById     = (id)      => api.get(`/cards/${id}`);
export const createCard      = (data)    => api.post('/cards', data);
export const updateCard      = (id, data)=> api.put(`/cards/${id}`, data);
export const deleteCard      = (id)      => api.delete(`/cards/${id}`);
export const moveCard        = (id, data)=> api.put(`/cards/${id}/move`, data);

export const getMembers           = ()                  => api.get('/members');
export const addMemberToCard      = (cardId, data)      => api.post(`/members/card/${cardId}`, data);
export const removeMemberFromCard = (cardId, memberId)  => api.delete(`/members/card/${cardId}/${memberId}`);

export const createChecklist     = (data)       => api.post('/checklists', data);
export const createChecklistItem = (data)       => api.post('/checklists/items', data);
export const updateChecklistItem = (id, data)   => api.put(`/checklists/items/${id}`, data);

export const addLabelToCard      = (cardId, data)            => api.post(`/labels/card/${cardId}`, data);
export const removeLabelFromCard = (cardId, labelId)         => api.delete(`/labels/card/${cardId}/${labelId}`);