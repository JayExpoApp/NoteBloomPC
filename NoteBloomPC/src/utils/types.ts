export type NoteCategory =
  | 'project' | 'shopping' | 'appointment' | 'process'
  | 'personal' | 'ideas' | 'travel' | 'health';

export type Priority = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  priority: Priority;
  color: string;
  emoji: string;
  checklist: ChecklistItem[];
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  progress?: number;
}

export const CATEGORIES: {
  key: NoteCategory; label: string; emoji: string;
  description: string; color: string;
}[] = [
  { key: 'project',     label: 'Projet',       emoji: '🚀', description: 'Plans & objectifs',   color: '#7C3AED' },
  { key: 'shopping',    label: 'Courses',       emoji: '🛒', description: "Listes d'achats",     color: '#F97316' },
  { key: 'appointment', label: 'Rendez-vous',   emoji: '📅', description: 'Agenda & rappels',    color: '#10B981' },
  { key: 'process',     label: 'Processus',     emoji: '⚙️', description: 'Suivi & étapes',      color: '#3B82F6' },
  { key: 'personal',    label: 'Personnel',     emoji: '💖', description: 'Journal intime',      color: '#EC4899' },
  { key: 'ideas',       label: 'Idées',         emoji: '💡', description: 'Inspirations',        color: '#F59E0B' },
  { key: 'travel',      label: 'Voyage',        emoji: '✈️', description: 'Itinéraires & tips',  color: '#06B6D4' },
  { key: 'health',      label: 'Santé',         emoji: '🏃', description: 'Sport & bien-être',   color: '#EF4444' },
];

export const PRIORITY_CONFIG = {
  low:    { label: 'Faible', emoji: '🟢', color: '#10B981' },
  medium: { label: 'Moyen',  emoji: '🟡', color: '#F59E0B' },
  high:   { label: 'Élevé',  emoji: '🔴', color: '#EF4444' },
};

export const NOTE_COLORS = [
  '#7C3AED','#F97316','#10B981','#3B82F6',
  '#EC4899','#F59E0B','#06B6D4','#EF4444',
  '#8B5CF6','#14B8A6','#F43F5E','#6366F1',
];

export const NOTE_EMOJIS = [
  '📝','🚀','🛒','📅','⚙️','💖','💡','✈️',
  '🏃','🎯','📚','🎨','🍕','🏠','💼','🌟',
  '🔥','⚡','🎵','🌿','🦋','🌈','🎁','🔑',
  '💰','🏆','🎉','🧠','❤️','⭐','🌙','☀️',
  '🍀','🎸','🏋️','🧘','🌺','🦄','🚂','🎮',
];

// Electron storage bridge type
declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        getAll: () => Promise<Record<string, any>>;
        clear: () => Promise<boolean>;
      };
      openExternal: (url: string) => void;
      platform: string;
    };
  }
}
