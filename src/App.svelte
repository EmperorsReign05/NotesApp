<script lang="ts">
  import NoteList from './components/NoteList.svelte';
  import NoteModal from './components/NoteModal.svelte';
  import NoteViewModal from './components/NoteViewModal.svelte';
  import ConfirmModal from './components/ConfirmModal.svelte';
  import ToastContainer from './components/ToastContainer.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import SortDropdown from './components/SortDropdown.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import { noteStore } from './stores/noteStore';
  import { toastStore } from './stores/toastStore';
  import type { Note } from './types/note';
  import { onMount } from 'svelte';

  let showModal = false;
  let editingNote: Note | null = null;
  let deletingNote: Note | null = null;
  let viewingNote: Note | null = null;
  let searchQuery = '';
  let sortBy = 'date-desc';
  let currentPath = '/';

  onMount(() => {
    currentPath = window.location.pathname;
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });
  });

  function handleView(event: CustomEvent<Note>) {
    viewingNote = event.detail;
  }

  function handleEditFromView(event: CustomEvent<Note>) {
    viewingNote = null;
    handleEdit(event);
  }

  function handleDeleteFromView(event: CustomEvent<Note>) {
    viewingNote = null;
    handleDeleteReq(event);
  }

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
    const activeEL = document.activeElement;
    const isInputActive = activeEL?.tagName === 'INPUT' || activeEL?.tagName === 'TEXTAREA';

    if (event.key === 'Escape') {
      closeModal();
      deletingNote = null;
      viewingNote = null;
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

<div class="h-screen w-full flex bg-[#fafafa] dark:bg-[#0A0A0A] overflow-hidden transition-colors duration-200 text-gray-900 dark:text-gray-100 font-sans">
  <Sidebar />
  
  <main class="flex-1 overflow-y-auto px-10 sm:px-14 lg:px-20 py-16 relative">
    <div class="absolute top-8 right-8 flex gap-3">
      <ThemeToggle />
    </div>

    <div class="max-w-[1600px] mx-auto h-full flex flex-col">
      {#if currentPath === '/' || currentPath === '/index.html'}
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-12 tracking-tight">Notes</h1>
        
        <div class="flex items-center justify-between mb-8">
          <SearchBar on:search={(e) => searchQuery = e.detail} />
          <SortDropdown on:sort={(e) => sortBy = e.detail} />
        </div>

        <NoteList on:view={handleView} on:edit={handleEdit} on:delete={handleDeleteReq} {searchQuery} {sortBy} />
        
        <footer class="mt-auto pt-16 pb-4 text-center text-sm font-medium text-gray-400 dark:text-slate-600">
          Created by <a href="https://github.com/EmperorsReign05" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline">@EmperorsReign05</a>
        </footer>
      {:else}
        <div class="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <h1 class="text-[150px] font-bold text-gray-200 dark:text-slate-800 tracking-tighter mb-4 leading-none">404</h1>
          <h2 class="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          <p class="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-10">We couldn't find the page you're looking for. It might have been moved or deleted.</p>
          <button on:click={() => { window.history.pushState({}, '', '/'); currentPath = '/'; }} class="px-8 py-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform shadow-lg">Return to Notes</button>
        </div>
      {/if}
    </div>
  </main>
</div>

{#if showModal}
  <NoteModal {editingNote} on:close={closeModal} />
{/if}

{#if viewingNote}
  <NoteViewModal 
    note={viewingNote} 
    on:close={() => viewingNote = null} 
    on:edit={handleEditFromView}
    on:delete={handleDeleteFromView}
  />
{/if}

{#if deletingNote}
  <ConfirmModal 
    title="Delete Note"
    message="Are you sure you want to delete '{deletingNote.title || 'Untitled'}'?"
    confirmText="Delete"
    on:close={() => deletingNote = null}
    on:confirm={handleConfirmDelete}
  />
{/if}

<style>
  :global(body) {
    background-color: #fafafa;
    margin: 0;
    overflow: hidden;
  }
  :global(.dark body) {
    background-color: #0A0A0A;
  }
</style>
