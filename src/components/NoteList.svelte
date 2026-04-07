<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { flip } from 'svelte/animate';
  import { scale, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { noteStore } from '../stores/noteStore';
  import NoteCard from './NoteCard.svelte';
  import Pagination from './Pagination.svelte';

  export let searchQuery = '';
  export let sortBy = 'date-desc';
  
  let currentPage = 1;
  const ITEMS_PER_PAGE = 20;

  // 1. Filtering Phase
  $: filteredNotes = $noteStore.notes.filter(note => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (note.title || '').toLowerCase().includes(q);
    const contentMatch = (note.content || '').toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });

  // 2. Sorting Phase
  $: sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc': return (a.title || '').localeCompare(b.title || '');
      case 'title-desc': return (b.title || '').localeCompare(a.title || '');
      case 'date-asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date-desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'id-asc': return (a.id || '').localeCompare(b.id || '');
      case 'id-desc': return (b.id || '').localeCompare(a.id || '');
      default: return 0;
    }
  });

  // 3. Pagination Phase
  $: totalPages = Math.ceil(sortedNotes.length / ITEMS_PER_PAGE);

  // Auto-reset page if bounds change (e.g., searching heavily filters items)
  $: {
    if (currentPage > totalPages && totalPages > 0) {
      tick().then(() => currentPage = 1);
    }
  }
  
  // Watch search query directly to reset to page 1 on new searches
  $: if(searchQuery !== undefined) {
    currentPage = 1;
  }

  $: paginatedNotes = sortedNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  onMount(() => {
    noteStore.fetchNotes();
  });
</script>

<div class="w-full mt-6">
  {#if $noteStore.loading && $noteStore.notes.length === 0}
    <!-- Loading Skeletons -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 animate-pulse h-48 flex flex-col">
          <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div class="space-y-2 flex-grow">
            <div class="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            <div class="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700 h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      {/each}
    </div>
  {:else if $noteStore.error && $noteStore.notes.length === 0}
    <!-- Error State -->
    <div class="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center border border-red-100 dark:border-red-800/50">
      <div class="mb-2">
        <svg class="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="font-medium">Error loading notes</p>
      <p class="text-sm mt-1">{$noteStore.error}</p>
    </div>
  {:else if $noteStore.notes.length === 0}
    <!-- Empty State -->
    <div class="py-16 px-6 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div class="text-gray-300 dark:text-slate-600 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No notes here yet</h3>
      <p class="text-gray-500 dark:text-slate-400 mt-2 text-sm max-w-sm mx-auto">Get started by creating your very first shiny note!</p>
    </div>
  {:else if filteredNotes.length === 0 && searchQuery}
    <!-- Search Empty State -->
    <div class="py-16 px-6 text-center rounded-2xl">
      <div class="text-gray-300 dark:text-slate-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No matching notes found</h3>
      <p class="text-gray-500 dark:text-slate-400 mt-1 text-sm max-w-sm mx-auto">Try adjusting your search query.</p>
    </div>
  {:else}
    <!-- Content State -->
    {#if $noteStore.error}
      <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800/50 text-center">
        {$noteStore.error}
      </div>
    {/if}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each paginatedNotes as note (note.id)}
        <div animate:flip={{ duration: 400, easing: quintOut }} in:scale={{ duration: 400, start: 0.8, easing: quintOut }} out:scale={{ duration: 200, start: 0.8 }}>
          <NoteCard {note} on:edit on:delete />
        </div>
      {/each}
    </div>

    <!-- Pagination Render -->
    <Pagination {currentPage} {totalPages} on:pageChange={(e) => currentPage = e.detail} />
  {/if}
</div>
