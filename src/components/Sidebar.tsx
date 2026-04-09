/* eslint-disable */
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { CATEGORIES, NoteCategory } from '../utils/types';

import './Sidebar.css';

interface SidebarProps {
  onNewNote: () => void;
  onSettings: () => void;
}

export default function Sidebar({ onNewNote, onSettings }: SidebarProps) {
  const {
    activeCategory, setActiveCategory,
    showFavorites, setShowFavorites,
    showArchived, setShowArchived,
    searchQuery, setSearchQuery,
    stats,
  } = useNotes();

  const handleAll = () => {
    setActiveCategory(null);
    setShowFavorites(false);
    setShowArchived(false);
  };

  return (
    <aside className="sidebar">
      {/* Logo section */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-emoji">🌸</span>
          <div>
            <div className="brand-name">NoteBloom</div>
            <div className="brand-sub">{stats.total} notes</div>
          </div>
        </div>
        <button className="new-btn" onClick={onNewNote} title="Nouvelle note (Ctrl+N)">
          <Plus size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      {/* Quick filters */}
      <div className="sidebar-section">
        <div className="section-label">GÉNÉRAL</div>
        <button
          className={`sidebar-item ${!activeCategory && !showFavorites && !showArchived ? 'active' : ''}`}
          onClick={handleAll}
        >
          <span className="item-emoji">✨</span>
          <span className="item-label">Toutes les notes</span>
          <span className="item-count">{stats.total}</span>
        </button>
        <button
          className={`sidebar-item ${showFavorites ? 'active' : ''}`}
          onClick={() => { setShowFavorites(!showFavorites); setShowArchived(false); setActiveCategory(null); }}
        >
          <span className="item-emoji">❤️</span>
          <span className="item-label">Favoris</span>
          <span className="item-count">{stats.favorites}</span>
        </button>
        <button
          className={`sidebar-item ${showArchived ? 'active' : ''}`}
          onClick={() => { setShowArchived(!showArchived); setShowFavorites(false); setActiveCategory(null); }}
        >
          <span className="item-emoji">📦</span>
          <span className="item-label">Archivées</span>
        </button>
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <div className="section-label">CATÉGORIES</div>
        {CATEGORIES.map(cat => {
          const count = stats.byCategory[cat.key] ?? 0;
          return (
            <button
              key={cat.key}
              className={`sidebar-item ${activeCategory === cat.key ? 'active' : ''}`}
              style={activeCategory === cat.key ? { '--item-color': cat.color } as any : {}}
              onClick={() => {
                setActiveCategory(activeCategory === cat.key ? null : cat.key as NoteCategory);
                setShowFavorites(false);
                setShowArchived(false);
              }}
            >
              <span className="item-emoji">{cat.emoji}</span>
              <span className="item-label">{cat.label}</span>
              {count > 0 && <span className="item-count">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={onSettings}>
          <span className="item-emoji">⚙️</span>
          <span className="item-label">Paramètres</span>
        </button>
      </div>
    </aside>
  );
}
