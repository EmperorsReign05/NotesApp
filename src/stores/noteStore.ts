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
    }
  };
}

export const noteStore = createNoteStore();
