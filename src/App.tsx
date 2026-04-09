/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { NotesProvider, useNotes } from './context/NotesContext';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { v4 as uuidv4 } from 'uuid';
import { Note, CATEGORIES } from './utils/types';
import './App.css';

function AppInner() {
  const { addNote } = useNotes();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNewNote = useCallback(async () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuidv4(),
      title: 'Nouvelle note',
      content: '',
      category: 'personal',
      priority: 'medium',
      color: '#7C3AED',
      emoji: '📝',
      checklist: [],
      tags: [],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
      progress: 0,
    };
    await addNote(newNote);
  }, [addNote]);

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <Sidebar onNewNote={handleNewNote} onSettings={() => setShowSettings(true)} />
        <NoteList />
        <NoteEditor />
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { notes, stats } = useNotes();
  const archived = notes.filter(n => n.isArchived).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal scale-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-emoji">🌸</span>
          <h2>NoteBloom</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-stats">
          {[
            { emoji: '📝', label: 'Notes', value: stats.total },
            { emoji: '📌', label: 'Épinglées', value: stats.pinned },
            { emoji: '❤️', label: 'Favoris', value: stats.favorites },
            { emoji: '📦', label: 'Archivées', value: archived },
          ].map(s => (
            <div key={s.label} className="modal-stat">
              <span>{s.emoji}</span>
              <span className="modal-stat-val">{s.value}</span>
              <span className="modal-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="modal-cats">
          <div className="modal-section-title">Par catégorie</div>
          {CATEGORIES.map(cat => {
            const count = stats.byCategory[cat.key] ?? 0;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={cat.key} className="modal-cat-row">
                <span className="modal-cat-emoji">{cat.emoji}</span>
                <div className="modal-cat-info">
                  <div className="modal-cat-header">
                    <span>{cat.label}</span>
                    <span style={{ color: cat.color }}>{count}</span>
                  </div>
                  <div className="modal-cat-track">
                    <div className="modal-cat-fill" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="modal-version">NoteBloom v1.0.0 — Application de bureau</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <AppInner />
    </NotesProvider>
  );
}
