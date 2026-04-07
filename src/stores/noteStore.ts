import { writable } from 'svelte/store';
import { noteService } from '../services/noteService';
import type { Note, CreateNoteDTO } from '../types/note';

function createNoteStore() {
  const { subscribe, set, update } = writable<{
    notes: Note[];
    loading: boolean;
    error: string | null;
    activeNoteId: string | null;
  }>({
    notes: [],
    loading: true,
    error: null,
    activeNoteId: null
  });

  return {
    subscribe,
    fetchNotes: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      // Setup minimal offline cache layer
      try {
        const cached = localStorage.getItem('notes_cache');
        if (cached) {
          update(state => ({ ...state, notes: JSON.parse(cached), loading: false }));
        }
      } catch (e) {
        console.error('Error parsing cache', e);
      }

      try {
        const notes = await noteService.getNotes();
        const sortedNotes = notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const DOCKET_COLORS = [
          'bg-[#F6A071]', // Peach Orange
          'bg-[#F5CB6A]', // Yellow Orange
          'bg-[#B282F3]', // Light Purple
          'bg-[#D3EE7E]', // Lime Green
          'bg-[#19D3EA]'  // Cyan
        ];
        
        const colorfulNotes = sortedNotes.map((n, i) => ({
          ...n,
          colorTheme: n.colorTheme || DOCKET_COLORS[i % DOCKET_COLORS.length]
        }));

        localStorage.setItem('notes_cache', JSON.stringify(colorfulNotes));
        update(state => ({ ...state, notes: colorfulNotes, loading: false, error: null }));
      } catch (err) {
        update(state => {
          const isOffline = !!localStorage.getItem('notes_cache');
          return { 
            ...state, 
            loading: false, 
            error: isOffline ? 'You are currently offline. Viewing cached notes.' : (err instanceof Error ? err.message : 'Unknown error') 
          };
        });
      }
    },
    addNote: async (data: CreateNoteDTO) => {
      const DOCKET_COLORS = ['bg-[#F6A071]', 'bg-[#F5CB6A]', 'bg-[#B282F3]', 'bg-[#D3EE7E]', 'bg-[#19D3EA]'];
      const tempId = `temp-${Date.now()}`;
      const tempNote: Note = {
        ...data,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        colorTheme: DOCKET_COLORS[Math.floor(Math.random() * DOCKET_COLORS.length)]
      };

      let rollbackNotes: Note[] = [];
      update(state => {
        rollbackNotes = state.notes;
        const newNotes = [tempNote, ...state.notes];
        localStorage.setItem('notes_cache', JSON.stringify(newNotes));
        return { ...state, notes: newNotes };
      });

      try {
        const savedNote = await noteService.createNote(data); 
        update(state => {
          const newNotes = state.notes.map(n => n.id === tempId ? savedNote : n);
          localStorage.setItem('notes_cache', JSON.stringify(newNotes));
          return { ...state, notes: newNotes };
        });
      } catch (err) {
        update(state => {
          localStorage.setItem('notes_cache', JSON.stringify(rollbackNotes));
          return { ...state, notes: rollbackNotes, error: 'Failed to create note. Rolled back changes.' };
        });
        throw err;
      }
    },
    editNote: async (id: string, data: Partial<CreateNoteDTO>) => {
      let rollbackNotes: Note[] = [];
      
      update(state => {
        rollbackNotes = state.notes;
        const newNotes = state.notes.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n);
        localStorage.setItem('notes_cache', JSON.stringify(newNotes));
        return { ...state, notes: newNotes };
      });

      try {
        await noteService.updateNote(id, data);
      } catch (err) {
        update(state => {
          localStorage.setItem('notes_cache', JSON.stringify(rollbackNotes));
          return { ...state, notes: rollbackNotes, error: 'Failed to update note. Rolled back changes.' };
        });
        throw err;
      }
    },
    softDeleteNote: (id: string, onActualDelete?: () => void) => {
      let noteToRestore: Note | undefined;
      
      update(state => {
        noteToRestore = state.notes.find(n => n.id === id);
        const newNotes = state.notes.filter(n => n.id !== id);
        localStorage.setItem('notes_cache', JSON.stringify(newNotes));
        return { ...state, notes: newNotes };
      });

      if (!noteToRestore) return null;

      const timeoutId = setTimeout(async () => {
        try {
          await noteService.deleteNote(id);
          if (onActualDelete) onActualDelete();
        } catch (err) {
          update(state => {
            const restoredNotes = [noteToRestore!, ...state.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            localStorage.setItem('notes_cache', JSON.stringify(restoredNotes));
            return {
              ...state,
              notes: restoredNotes,
              error: 'Failed to delete note permanently.'
            };
          });
        }
      }, 10000);

      return () => {
        clearTimeout(timeoutId);
        update(state => {
          const restoredNotes = [noteToRestore!, ...state.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          localStorage.setItem('notes_cache', JSON.stringify(restoredNotes));
          return {
            ...state,
            notes: restoredNotes
          };
        });
      };
    },
    setActiveNote: (id: string | null) => {
      update(state => ({ ...state, activeNoteId: id }));
    },
    closeActiveNote: () => {
      update(state => ({ ...state, activeNoteId: null }));
    }
  };
}

export const noteStore = createNoteStore();
