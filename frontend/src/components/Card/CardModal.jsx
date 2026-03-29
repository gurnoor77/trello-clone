import { useState, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import * as boardService from '../../services/boardService';
import './CardModal.css';

const CardModal = ({ card, listId, onClose }) => {
  const { removeCard, members } = useBoard();
  const [cardData, setCardData]     = useState(null);
  const [title, setTitle]           = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate]       = useState(card.due_date || '');
  const [newItem, setNewItem]       = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    const res = await boardService.getCardById(card.id);
    setCardData(res.data);
    setTitle(res.data.title);
    setDescription(res.data.description || '');
    setDueDate(res.data.due_date ? res.data.due_date.split('T')[0] : '');
  };

  const handleSave = async () => {
    await boardService.updateCard(card.id, {
      title, description, due_date: dueDate || null, archived: false
    });
    onClose();
  };

  const handleDelete = async () => {
    await removeCard(listId, card.id);
    onClose();
  };

  const addChecklist = async () => {
    if (!checklistTitle.trim()) return;
    await boardService.api.post(`/checklists`, { card_id: card.id, title: checklistTitle });
    setChecklistTitle('');
    fetchCardData();
  };

  const addChecklistItem = async (checklistId) => {
    if (!newItem.trim()) return;
    await boardService.api.post(`/checklist-items`, { checklist_id: checklistId, text: newItem });
    setNewItem('');
    fetchCardData();
  };

  const toggleItem = async (itemId, isDone) => {
    await boardService.api.put(`/checklist-items/${itemId}`, { is_done: !isDone });
    fetchCardData();
  };

  const addLabel = async (color, name) => {
    await boardService.api.post(`/labels/card/${card.id}`, { color, name });
    fetchCardData();
  };

  const assignMember = async (memberId) => {
    await boardService.addMemberToCard(card.id, { member_id: memberId });
    fetchCardData();
  };

  const LABEL_COLORS = [
    { color: '#eb5a46', name: 'Bug' },
    { color: '#0079bf', name: 'Feature' },
    { color: '#f2d600', name: 'Urgent' },
    { color: '#61bd4f', name: 'Done' },
    { color: '#ff9f1a', name: 'In Progress' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <div className="modal-main">
            <input
              className="modal-title-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <div className="modal-section">
              <h4>Description</h4>
              <textarea
                className="modal-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
              />
            </div>

            <div className="modal-section">
              <h4>Due Date</h4>
              <input
                type="date"
                className="modal-date-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            {cardData?.checklists?.map(checklist => (
              <div key={checklist.id} className="modal-section">
                <h4>☑ {checklist.title}</h4>
                {checklist.items?.map(item => (
                  <div key={item.id} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.is_done}
                      onChange={() => toggleItem(item.id, item.is_done)}
                    />
                    <span className={item.is_done ? 'done' : ''}>{item.text}</span>
                  </div>
                ))}
                <div className="add-item-row">
                  <input
                    placeholder="Add an item..."
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addChecklistItem(checklist.id)}
                    className="add-item-input"
                  />
                  <button onClick={() => addChecklistItem(checklist.id)} className="add-btn">Add</button>
                </div>
              </div>
            ))}

            <div className="modal-section">
              <h4>Add Checklist</h4>
              <div className="add-item-row">
                <input
                  placeholder="Checklist title..."
                  value={checklistTitle}
                  onChange={e => setChecklistTitle(e.target.value)}
                  className="add-item-input"
                />
                <button onClick={addChecklist} className="add-btn">Add</button>
              </div>
            </div>
          </div>

          <div className="modal-sidebar">
            <div className="modal-section">
              <h4>Labels</h4>
              <div className="labels-list">
                {cardData?.labels?.map(l => (
                  <span key={l.id} className="label-tag"
                    style={{ background: l.color }}>{l.name}</span>
                ))}
              </div>
              <div className="label-options">
                {LABEL_COLORS.map(l => (
                  <div key={l.color} className="label-option"
                    style={{ background: l.color }}
                    onClick={() => addLabel(l.color, l.name)}>
                    {l.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>Members</h4>
              <div className="members-list">
                {cardData?.members?.map(m => (
                  <div key={m.id} className="member-avatar">{m.name[0]}</div>
                ))}
              </div>
              <div className="member-options">
                {members.map(m => (
                  <div key={m.id} className="member-option"
                    onClick={() => assignMember(m.id)}>
                    <div className="member-avatar">{m.name[0]}</div>
                    <span>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="delete-btn" onClick={handleDelete}>Delete Card</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;