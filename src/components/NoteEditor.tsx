import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Pin, Heart, Archive, Trash2, Share2, Plus, X,
  ChevronDown, Check, Calendar, Tag
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { Note, ChecklistItem, NoteCategory, Priority, CATEGORIES, PRIORITY_CONFIG, NOTE_COLORS, NOTE_EMOJIS } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './NoteEditor.css';

export default function NoteEditor() {
  const { selectedNote, addNote, updateNote, deleteNote, togglePin, toggleFavorite, toggleArchive, toggleChecklistItem } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<'note' | 'checklist' | 'details'>('note');
  const [newCheckText, setNewCheckText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedNote) {
      setEditNote({ ...selectedNote });
      setIsEditing(false);
    }
  }, [selectedNote?.id]);

  const autoSave = useCallback((note: Note) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => updateNote(note), 600);
  }, [updateNote]);

  const handleField = (field: keyof Note, value: any) => {
    if (!editNote) return;
    const updated = { ...editNote, [field]: value };
    setEditNote(updated);
    autoSave(updated);
  };

  const addChecklist = () => {
    if (!newCheckText.trim() || !editNote) return;
    const item: ChecklistItem = { id: uuidv4(), text: newCheckText.trim(), checked: false };
    const checklist = [...editNote.checklist, item];
    const progress = Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100);
    handleField('checklist', checklist);
    handleField('progress', progress);
    setNewCheckText('');
  };

  const toggleCheck = (itemId: string) => {
    if (!editNote) return;
    const checklist = editNote.checklist.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i);
    const progress = checklist.length > 0 ? Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100) : 0;
    const updated = { ...editNote, checklist, progress };
    setEditNote(updated);
    autoSave(updated);
  };

  const deleteCheck = (itemId: string) => {
    if (!editNote) return;
    const checklist = editNote.checklist.filter(i => i.id !== itemId);
    const progress = checklist.length > 0 ? Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100) : 0;
    handleField('checklist', checklist);
    handleField('progress', progress);
  };

  const addTag = () => {
    if (!newTag.trim() || !editNote) return;
    const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (!editNote.tags.includes(tag)) handleField('tags', [...editNote.tags, tag]);
    setNewTag('');
  };

  const handleDelete = async () => {
    if (!editNote) return;
    if (window.confirm(`Supprimer "${editNote.title}" ?`)) {
      await deleteNote(editNote.id);
    }
  };

  if (!editNote) {
    return (
      <div className="editor-empty">
        <span className="empty-big-emoji">🌸</span>
        <h2>Sélectionnez une note</h2>
        <p>ou créez-en une nouvelle avec le bouton +</p>
      </div>
    );
  }

  const checkedCount = editNote.checklist.filter(i => i.checked).length;
  const totalCount = editNote.checklist.length;
  const progress = editNote.progress ?? (totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0);
  const cat = CATEGORIES.find(c => c.key === editNote.category)!;

  return (
    <div className="editor" style={{ '--editor-color': editNote.color } as any}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <span className="editor-cat-badge" style={{ color: editNote.color, borderColor: editNote.color + '44' }}>
            {cat.emoji} {cat.label}
          </span>
          <span className="editor-date">
            {format(new Date(editNote.updatedAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
          </span>
        </div>
        <div className="toolbar-right">
          <ToolBtn
            active={editNote.isPinned}
            onClick={() => { togglePin(editNote.id); handleField('isPinned', !editNote.isPinned); }}
            title={editNote.isPinned ? 'Désépingler' : 'Épingler'}
            color="var(--warning)"
          ><Pin size={15} /></ToolBtn>
          <ToolBtn
            active={editNote.isFavorite}
            onClick={() => { toggleFavorite(editNote.id); handleField('isFavorite', !editNote.isFavorite); }}
            title={editNote.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            color="var(--pink)"
          ><Heart size={15} /></ToolBtn>
          <ToolBtn onClick={() => { toggleArchive(editNote.id); handleField('isArchived', !editNote.isArchived); }} title={editNote.isArchived ? 'Désarchiver' : 'Archiver'}>
            <Archive size={15} />
          </ToolBtn>
          <ToolBtn onClick={handleDelete} title="Supprimer" danger><Trash2 size={15} /></ToolBtn>
        </div>
      </div>

      {/* Color + Emoji strip */}
      <div className="editor-meta-strip">
        <div className="emoji-picker-wrap">
          <button className="emoji-main-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            {editNote.emoji}
          </button>
          {showEmojiPicker && (
            <div className="emoji-dropdown scale-in">
              {NOTE_EMOJIS.map(e => (
                <button key={e} className="emoji-opt" onClick={() => { handleField('emoji', e); setShowEmojiPicker(false); }}>{e}</button>
              ))}
            </div>
          )}
        </div>
        <div className="color-dots">
          {NOTE_COLORS.map(c => (
            <button
              key={c}
              className={`color-dot ${editNote.color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => handleField('color', c)}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <textarea
        ref={titleRef}
        className="editor-title"
        value={editNote.title}
        onChange={e => handleField('title', e.target.value)}
        placeholder="Titre de la note..."
        rows={1}
        onInput={e => {
          const t = e.target as HTMLTextAreaElement;
          t.style.height = 'auto';
          t.style.height = t.scrollHeight + 'px';
        }}
      />

      {/* Tabs */}
      <div className="editor-tabs">
        {(['note', 'checklist', 'details'] as const).map(tab => {
          const labels = { note: '📝 Note', checklist: `✅ Liste${totalCount > 0 ? ` (${checkedCount}/${totalCount})` : ''}`, details: '⚙️ Détails' };
          return (
            <button
              key={tab}
              className={`editor-tab ${activeTab === tab ? 'active' : ''}`}
              style={activeTab === tab ? { borderBottomColor: editNote.color, color: editNote.color } : {}}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="editor-body">
        {/* NOTE TAB */}
        {activeTab === 'note' && (
          <textarea
            className="editor-content"
            value={editNote.content}
            onChange={e => handleField('content', e.target.value)}
            placeholder="Écrivez votre note ici... 💭"
          />
        )}

        {/* CHECKLIST TAB */}
        {activeTab === 'checklist' && (
          <div className="checklist-panel">
            {totalCount > 0 && (
              <div className="checklist-progress">
                <div className="cp-header">
                  <span>{checkedCount}/{totalCount} complétés</span>
                  <span style={{ color: editNote.color, fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="cp-track">
                  <div className="cp-fill" style={{ width: `${progress}%`, background: editNote.color }} />
                </div>
              </div>
            )}
            {editNote.checklist.map(item => (
              <div key={item.id} className="check-row">
                <button
                  className={`check-box ${item.checked ? 'checked' : ''}`}
                  style={item.checked ? { background: editNote.color, borderColor: editNote.color } : {}}
                  onClick={() => toggleCheck(item.id)}
                >
                  {item.checked && <Check size={12} />}
                </button>
                <span className={`check-text ${item.checked ? 'done' : ''}`}>{item.text}</span>
                <button className="check-delete" onClick={() => deleteCheck(item.id)}><X size={12} /></button>
              </div>
            ))}
            <div className="add-check-row">
              <span className="add-check-icon" style={{ color: editNote.color }}>⊕</span>
              <input
                className="add-check-input"
                placeholder="Ajouter un élément..."
                value={newCheckText}
                onChange={e => setNewCheckText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addChecklist()}
              />
              {newCheckText && (
                <button className="add-check-btn" style={{ background: editNote.color }} onClick={addChecklist}>
                  <Plus size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="details-panel">
            <div className="detail-section">
              <label className="detail-label">📂 Catégorie</label>
              <div className="cat-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`cat-chip ${editNote.category === cat.key ? 'active' : ''}`}
                    style={editNote.category === cat.key ? { background: cat.color + '22', borderColor: cat.color, color: cat.color } : {}}
                    onClick={() => { handleField('category', cat.key); handleField('color', cat.color); }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">🎯 Priorité</label>
              <div className="priority-row">
                {(['low', 'medium', 'high'] as Priority[]).map(p => {
                  const cfg = PRIORITY_CONFIG[p];
                  return (
                    <button
                      key={p}
                      className={`priority-btn ${editNote.priority === p ? 'active' : ''}`}
                      style={editNote.priority === p ? { background: cfg.color + '22', borderColor: cfg.color, color: cfg.color } : {}}
                      onClick={() => handleField('priority', p)}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">🏷️ Tags</label>
              <div className="tags-row">
                {editNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="tag-chip"
                    style={{ borderColor: editNote.color + '66', color: editNote.color }}
                    onClick={() => handleField('tags', editNote.tags.filter(t => t !== tag))}
                  >
                    #{tag} <X size={10} />
                  </span>
                ))}
              </div>
              <div className="add-tag-row">
                <Tag size={14} color="var(--text-muted)" />
                <input
                  className="add-tag-input"
                  placeholder="Nouveau tag..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                />
                {newTag && <button className="add-check-btn" style={{ background: editNote.color }} onClick={addTag}><Plus size={14} /></button>}
              </div>
            </div>

            <div className="detail-section">
              <label className="detail-label">📅 Échéance</label>
              <input
                type="date"
                className="date-input"
                value={editNote.dueDate ? editNote.dueDate.split('T')[0] : ''}
                onChange={e => handleField('dueDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
            </div>

            <div className="detail-meta">
              <div className="meta-row">
                <span>Créée</span>
                <span>{format(new Date(editNote.createdAt), 'd MMMM yyyy', { locale: fr })}</span>
              </div>
              <div className="meta-row">
                <span>Modifiée</span>
                <span>{format(new Date(editNote.updatedAt), 'd MMMM yyyy à HH:mm', { locale: fr })}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolBtn({ children, onClick, active, color, title, danger }: any) {
  return (
    <button
      className={`tool-btn ${active ? 'active' : ''} ${danger ? 'danger' : ''}`}
      style={active && color ? { color, background: color + '22' } : {}}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
