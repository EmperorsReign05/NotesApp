import { apiClient } from '../utils/apiClient';
import type { Note, CreateNoteDTO, UpdateNoteDTO } from '../types/note';

const RESOURCE = '/notes';

export const noteService = {
  async getNotes(): Promise<Note[]> {
    return apiClient.get<Note[]>(RESOURCE);
  },

  async getNoteById(id: string): Promise<Note> {
    return apiClient.get<Note>(`${RESOURCE}/${id}`);
  },

  async createNote(data: CreateNoteDTO): Promise<Note> {
    const newNote = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return apiClient.post<Note>(RESOURCE, newNote);
  },

  async updateNote(id: string, data: UpdateNoteDTO): Promise<Note> {
    const syncData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return apiClient.put<Note>(`${RESOURCE}/${id}`, syncData);
  },

  async deleteNote(id: string): Promise<Note> {
    return apiClient.delete<Note>(`${RESOURCE}/${id}`);
  }
};
