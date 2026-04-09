import React from 'react';
import { Pin, Heart, Calendar, CheckSquare } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { Note, CATEGORIES, PRIORITY_CONFIG } from '../utils/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './NoteList.css';

export default function NoteList() {
  const { filteredNotes, selectedNote, setSelectedNote, isLoading } = useNotes();

  if (isLoading) {
    return (
      <div className="notelist notelist-empty">
        <div className="loading-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="notelist notelist-empty">
        <span className="empty-emoji">📭</span>
        <p className="empty-title">Aucune note</p>
        <p className="empty-sub">Créez une note avec le bouton +</p>
      </div>
    );
  }

  return (
    <div className="notelist">
      <div className="notelist-header">
        <span className="notelist-count">{filteredNotes.length} note{filteredNotes.length > 1 ? 's' : ''}</span>
      </div>
      <div className="notelist-scroll">
        {filteredNotes.map(note => (
          <NoteListItem
            key={note.id}
            note={note}
            isSelected={selectedNote?.id === note.id}
            onClick={() => setSelectedNote(note)}
          />
        ))}
      </div>
    </div>
  );
}

function NoteListItem({ note, isSelected, onClick }: { note: Note; isSelected: boolean; onClick: () => void }) {
  const cat = CATEGORIES.find(c => c.key === note.category)!;
  const checkedCount = note.checklist.filter(i => i.checked).length;
  const totalCount = note.checklist.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : note.progress ?? 0;

  return (
    <div
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ '--note-color': note.color } as any}
    >
      <div className="note-item-bar" style={{ background: note.color }} />
      <div className="note-item-content">
        <div className="note-item-header">
          <span className="note-item-emoji">{note.emoji}</span>
          <span className="note-item-title">{note.title}</span>
          <div className="note-item-badges">
            {note.isPinned && <Pin size={11} className="badge-pin" />}
            {note.isFavorite && <Heart size={11} className="badge-heart" />}
          </div>
        </div>

        {note.content && (
          <p className="note-item-preview">{note.content}</p>
        )}

        {totalCount > 0 && (
          <div className="note-item-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%`, background: note.color }} />
            </div>
            <span className="progress-label" style={{ color: note.color }}>{progress}%</span>
          </div>
        )}

        <div className="note-item-footer">
          <span className="note-item-cat" style={{ color: note.color, borderColor: note.color + '44' }}>
            {cat.emoji} {cat.label}
          </span>
          <span className="note-item-date">
            {format(new Date(note.updatedAt), 'd MMM', { locale: fr })}
          </span>
        </div>
      </div>
    </div>
  );
}
