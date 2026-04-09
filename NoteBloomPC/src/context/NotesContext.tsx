import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteCategory, Priority } from '../utils/types';
import { StorageService } from '../utils/storage';

const DEMO_NOTES: Note[] = [
  {
    id: uuidv4(), title: 'Refonte site web 🚀', content: 'Planification complète de la refonte du site avec nouveau design.',
    category: 'project', priority: 'high', color: '#7C3AED', emoji: '🚀',
    checklist: [
      { id: uuidv4(), text: 'Analyse des besoins', checked: true },
      { id: uuidv4(), text: 'Maquettes Figma', checked: true },
      { id: uuidv4(), text: 'Développement frontend', checked: false },
      { id: uuidv4(), text: 'Tests utilisateurs', checked: false },
      { id: uuidv4(), text: 'Mise en ligne', checked: false },
    ],
    tags: ['web', 'design', 'urgent'], isPinned: true, isFavorite: false, isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(), progress: 40,
  },
  {
    id: uuidv4(), title: 'Courses du week-end', content: 'Dîner de dimanche avec la famille.',
    category: 'shopping', priority: 'medium', color: '#F97316', emoji: '🛒',
    checklist: [
      { id: uuidv4(), text: 'Tomates × 6', checked: true },
      { id: uuidv4(), text: 'Pâtes × 2 paquets', checked: true },
      { id: uuidv4(), text: 'Parmesan', checked: false },
      { id: uuidv4(), text: 'Vin rouge 🍷', checked: false },
      { id: uuidv4(), text: 'Pain frais 🥖', checked: false },
    ],
    tags: ['nourriture', 'famille'], isPinned: false, isFavorite: true, isArchived: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(), progress: 40,
  },
  {
    id: uuidv4(), title: 'RDV Dentiste', content: 'Contrôle annuel + détartrage. Apporter carte vitale et mutuelle.',
    category: 'appointment', priority: 'high', color: '#10B981', emoji: '😁',
    checklist: [
      { id: uuidv4(), text: 'Carte vitale', checked: false },
      { id: uuidv4(), text: 'Carte mutuelle', checked: false },
    ],
    tags: ['santé'], isPinned: false, isFavorite: false, isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), progress: 0,
  },
  {
    id: uuidv4(), title: 'Apprendre le piano 🎹', content: 'Progression hebdomadaire pour maîtriser les bases.',
    category: 'process', priority: 'low', color: '#3B82F6', emoji: '🎹',
    checklist: [
      { id: uuidv4(), text: 'Semaine 1 : Posture & notes', checked: true },
      { id: uuidv4(), text: 'Semaine 2 : Gamme de Do', checked: true },
      { id: uuidv4(), text: 'Semaine 3 : Accords de base', checked: true },
      { id: uuidv4(), text: 'Semaine 4 : Première mélodie', checked: false },
      { id: uuidv4(), text: 'Semaine 5 : Mains ensemble', checked: false },
      { id: uuidv4(), text: 'Semaine 6 : Morceau complet', checked: false },
    ],
    tags: ['musique', 'apprentissage'], isPinned: false, isFavorite: true, isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(), progress: 50,
  },
  {
    id: uuidv4(), title: 'Vacances à Barcelone', content: 'Voyage prévu en juin ! Tout ce qu\'il faut voir.',
    category: 'travel', priority: 'medium', color: '#06B6D4', emoji: '🌊',
    checklist: [
      { id: uuidv4(), text: 'Réserver l\'hôtel', checked: true },
      { id: uuidv4(), text: 'Billets d\'avion', checked: true },
      { id: uuidv4(), text: 'Sagrada Família', checked: false },
      { id: uuidv4(), text: 'Parc Güell', checked: false },
    ],
    tags: ['voyage', 'espagne'], isPinned: false, isFavorite: false, isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString(), progress: 50,
  },
];

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: NoteCategory | null;
  setActiveCategory: (c: NoteCategory | null) => void;
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
  showArchived: boolean;
  setShowArchived: (v: boolean) => void;
  selectedNote: Note | null;
  setSelectedNote: (n: Note | null) => void;
  filteredNotes: Note[];
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  toggleChecklistItem: (noteId: string, itemId: string) => Promise<void>;
  stats: { total: number; pinned: number; favorites: number; byCategory: Record<string, number> };
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoteCategory | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await StorageService.getNotes();
      if (stored.length === 0) {
        await StorageService.saveNotes(DEMO_NOTES);
        setNotes(DEMO_NOTES);
      } else {
        setNotes(stored);
      }
      setIsLoading(false);
    })();
  }, []);

  const filteredNotes = [...notes]
    .filter(n => {
      if (!showArchived && n.isArchived) return false;
      if (showFavorites && !n.isFavorite) return false;
      if (activeCategory && n.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const addNote = useCallback(async (note: Note) => {
    const updated = await StorageService.addNote(note);
    setNotes(updated);
    setSelectedNote(note);
  }, []);

  const updateNote = useCallback(async (note: Note) => {
    const n = { ...note, updatedAt: new Date().toISOString() };
    const updated = await StorageService.updateNote(n);
    setNotes(updated);
    setSelectedNote(n);
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const updated = await StorageService.deleteNote(id);
    setNotes(updated);
    if (selectedNote?.id === id) setSelectedNote(updated[0] ?? null);
  }, [selectedNote]);

  const togglePin = useCallback(async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) await updateNote({ ...note, isPinned: !note.isPinned });
  }, [notes, updateNote]);

  const toggleFavorite = useCallback(async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) await updateNote({ ...note, isFavorite: !note.isFavorite });
  }, [notes, updateNote]);

  const toggleArchive = useCallback(async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) await updateNote({ ...note, isArchived: !note.isArchived });
  }, [notes, updateNote]);

  const toggleChecklistItem = useCallback(async (noteId: string, itemId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    const checklist = note.checklist.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i);
    const progress = checklist.length > 0
      ? Math.round((checklist.filter(i => i.checked).length / checklist.length) * 100) : 0;
    await updateNote({ ...note, checklist, progress });
  }, [notes, updateNote]);

  const stats = {
    total: notes.filter(n => !n.isArchived).length,
    pinned: notes.filter(n => n.isPinned && !n.isArchived).length,
    favorites: notes.filter(n => n.isFavorite && !n.isArchived).length,
    byCategory: notes.reduce((acc, n) => {
      if (!n.isArchived) acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <NotesContext.Provider value={{
      notes, isLoading, searchQuery, setSearchQuery,
      activeCategory, setActiveCategory, showFavorites, setShowFavorites,
      showArchived, setShowArchived, selectedNote, setSelectedNote,
      filteredNotes, addNote, updateNote, deleteNote,
      togglePin, toggleFavorite, toggleArchive, toggleChecklistItem, stats,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
