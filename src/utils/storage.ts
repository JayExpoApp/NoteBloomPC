import { Note } from './types';

const NOTES_KEY = 'notes';

// Fallback to localStorage if not in Electron
const isElectron = typeof window !== 'undefined' && window.electron;

async function storeGet(key: string): Promise<any> {
  if (isElectron) return window.electron.store.get(key);
  const raw = localStorage.getItem(`notebloom_${key}`);
  return raw ? JSON.parse(raw) : undefined;
}

async function storeSet(key: string, value: any): Promise<void> {
  if (isElectron) {
    await window.electron.store.set(key, value);
  } else {
    localStorage.setItem(`notebloom_${key}`, JSON.stringify(value));
  }
}

export const StorageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const data = await storeGet(NOTES_KEY);
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    await storeSet(NOTES_KEY, notes);
  },

  async addNote(note: Note): Promise<Note[]> {
    const notes = await this.getNotes();
    const updated = [note, ...notes];
    await this.saveNotes(updated);
    return updated;
  },

  async updateNote(note: Note): Promise<Note[]> {
    const notes = await this.getNotes();
    const updated = notes.map(n => n.id === note.id ? note : n);
    await this.saveNotes(updated);
    return updated;
  },

  async deleteNote(id: string): Promise<Note[]> {
    const notes = await this.getNotes();
    const updated = notes.filter(n => n.id !== id);
    await this.saveNotes(updated);
    return updated;
  },
};
