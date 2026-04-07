<script lang="ts">
  import NoteList from './components/NoteList.svelte';
  import NoteModal from './components/NoteModal.svelte';
  import ConfirmModal from './components/ConfirmModal.svelte';
  import ToastContainer from './components/ToastContainer.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import SortDropdown from './components/SortDropdown.svelte';
  import { noteStore } from './stores/noteStore';
  import { toastStore } from './stores/toastStore';
  import type { Note } from './types/note';

  let showModal = false;
  let editingNote: Note | null = null;
  let deletingNote: Note | null = null;
  let searchQuery = '';
  let sortBy = 'date-desc';

  function openCreateModal() {
    editingNote = null;
    showModal = true;
  }

  function handleEdit(event: CustomEvent<Note>) {
    editingNote = event.detail;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingNote = null;
  }

  function handleDeleteReq(event: CustomEvent<Note>) {
    deletingNote = event.detail;
  }

  function handleConfirmDelete() {
    if (!deletingNote) return;
    const undoFn = noteStore.softDeleteNote(deletingNote.id);
    if (undoFn) {
      toastStore.addToast('Note moved to trash.', 'undo', undoFn);
    }
    deletingNote = null;
  }
</script>

<ToastContainer />

<main class="min-h-screen bg-[#F8FAFC] text-gray-900 py-10 px-4 sm:px-6 lg:px-8 relative">
  <div class="max-w-6xl mx-auto">
    <header class="mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">My Notes</h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">Capture your thoughts, ideas, and tasks.</p>
      </div>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-fit">
        <SortDropdown on:sort={(e) => sortBy = e.detail} />
        <SearchBar on:search={(e) => searchQuery = e.detail} />
        
        <button 
          on:click={openCreateModal}
          class="shrink-0 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-5 h-5 mr-1.5 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>
    </header>

    <NoteList on:edit={handleEdit} on:delete={handleDeleteReq} {searchQuery} {sortBy} />
  </div>
</main>

{#if showModal}
  <NoteModal {editingNote} on:close={closeModal} />
{/if}

{#if deletingNote}
  <ConfirmModal 
    title="Delete Note"
    message="Are you sure you want to delete '{deletingNote.title || 'Untitled'}'? You'll have 10 seconds to undo this action."
    confirmText="Delete"
    on:close={() => deletingNote = null}
    on:confirm={handleConfirmDelete}
  />
{/if}

<style>
  :global(body) {
    background-color: #F8FAFC;
  }
</style>
