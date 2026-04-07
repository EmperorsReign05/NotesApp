<script lang="ts">
  import NoteList from './components/NoteList.svelte';
  import NoteModal from './components/NoteModal.svelte';
  import ConfirmModal from './components/ConfirmModal.svelte';
  import ToastContainer from './components/ToastContainer.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import SortDropdown from './components/SortDropdown.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
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

  function handleKeydown(event: KeyboardEvent) {
    // Only trigger if not typing inside an input/textarea (except for Escape)
    const activeEL = document.activeElement;
    const isInputActive = activeEL?.tagName === 'INPUT' || activeEL?.tagName === 'TEXTAREA';

    if (event.key === 'Escape') {
      closeModal();
      deletingNote = null;
      return;
    }

    if (event.altKey && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      openCreateModal();
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      const searchInput = document.getElementById('global-search') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<ToastContainer />

<main class="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8 relative transition-colors duration-200">

  <div class="max-w-6xl mx-auto">
    <header class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div class="flex justify-between items-center w-full md:w-auto">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">My Notes</h1>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400 font-medium">Capture your thoughts, ideas, and tasks.</p>
        </div>
        <div class="md:hidden">
          <ThemeToggle />
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-fit">
        <ThemeToggle />
        <SortDropdown on:sort={(e) => sortBy = e.detail} />
        <SearchBar on:search={(e) => searchQuery = e.detail} />
        
        <button 
          on:click={openCreateModal}
          title="New Note (Alt + N)"
          class="shrink-0 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Note
          <span class="hidden sm:inline-block ml-2 text-[10px] font-medium bg-blue-700/50 px-1 rounded border border-blue-500/30 text-blue-100">Alt+N</span>
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
  :global(.dark body) {
    background-color: #0f172a;
  }
</style>
