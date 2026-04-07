import { writable } from 'svelte/store';
import { noteService } from '../services/noteService';
import type { Note, CreateNoteDTO } from '../types/note';

function createNoteStore() {
  const { subscribe, set, update } = writable<{
    notes: Note[];
    loading: boolean;
    error: string | null;
  }>({
    notes: [],
    loading: true,
    error: null
  });

  return {
    subscribe,
    fetchNotes: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const notes = await noteService.getNotes();
        // Since the latest mockAPI might bring newest at the bottom depending on sorting, we reverse it to newest first.
        const sortedNotes = notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        set({ notes: sortedNotes, loading: false, error: null });
      } catch (err) {
        update(state => ({ ...state, loading: false, error: err instanceof Error ? err.message : 'Unknown error' }));
      }
    },
    addNote: async (data: CreateNoteDTO) => {
      // 1. Optimistic UI update
      const tempId = `temp-${Date.now()}`;
      const tempNote: Note = {
        ...data,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let rollbackNotes: Note[] = [];
      update(state => {
        rollbackNotes = state.notes;
        return { ...state, notes: [tempNote, ...state.notes] }; // Add to top optimistically
      });

      // 2. Actual API Call
      try {
        const savedNote = await noteService.createNote(data); // Call MockAPI
        
        // 3. Replace tempnote with server-returned note (has correct server ID)
        update(state => ({
          ...state,
          notes: state.notes.map(n => n.id === tempId ? savedNote : n)
        }));
      } catch (err) {
        // 4. Rollback if error occurs
        update(state => ({ ...state, notes: rollbackNotes, error: 'Failed to create note. Rolled back changes.' }));
        throw err;
      }
    },
    editNote: async (id: string, data: Partial<CreateNoteDTO>) => {
      let rollbackNotes: Note[] = [];
      
      update(state => {
        rollbackNotes = state.notes;
        return {
          ...state,
          notes: state.notes.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n)
        };
      });

      try {
        await noteService.updateNote(id, data);
      } catch (err) {
        update(state => ({ ...state, notes: rollbackNotes, error: 'Failed to update note. Rolled back changes.' }));
        throw err;
      }
    },
    softDeleteNote: (id: string, onActualDelete?: () => void) => {
      let noteToRestore: Note | undefined;
      
      // 1. Instantly hide note from UI
      update(state => {
        noteToRestore = state.notes.find(n => n.id === id);
        return {
          ...state,
          notes: state.notes.filter(n => n.id !== id)
        };
      });

      if (!noteToRestore) return null;

      // 2. Set 10-second timer to call the real API
      const timeoutId = setTimeout(async () => {
        try {
          await noteService.deleteNote(id);
          if (onActualDelete) onActualDelete();
        } catch (err) {
          // If real API delete fails, bring it back and show an error
          update(state => ({
            ...state,
            notes: [noteToRestore!, ...state.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            error: 'Failed to delete note permanently.'
          }));
        }
      }, 10000);

      // 3. Return an undo function
      return () => {
        clearTimeout(timeoutId);
        update(state => ({
          ...state,
          notes: [noteToRestore!, ...state.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }));
      };
    }
  };
}

export const noteStore = createNoteStore();
