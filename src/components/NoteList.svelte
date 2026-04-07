<script lang="ts">
  import { onMount } from 'svelte';
  import { noteStore } from '../stores/noteStore';
  import NoteCard from './NoteCard.svelte';

  export let searchQuery = '';

  $: filteredNotes = $noteStore.notes.filter(note => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (note.title || '').toLowerCase().includes(q);
    const contentMatch = (note.content || '').toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });

  onMount(() => {
    noteStore.fetchNotes();
  });
</script>

<div class="w-full mt-6">
  {#if $noteStore.loading && $noteStore.notes.length === 0}
    <!-- Loading Skeletons -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <div class="bg-white rounded-xl border border-gray-100 p-5 animate-pulse h-48 flex flex-col">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="space-y-2 flex-grow">
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-50 h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      {/each}
    </div>
  {:else if $noteStore.error && $noteStore.notes.length === 0}
    <!-- Error State -->
    <div class="p-6 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
      <div class="text-red-400 mb-2">
        <svg class="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="font-medium">Error loading notes</p>
      <p class="text-sm mt-1">{$noteStore.error}</p>
    </div>
  {:else if $noteStore.notes.length === 0}
    <!-- Empty State -->
    <div class="py-16 px-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm">
      <div class="text-gray-300 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No notes here yet</h3>
      <p class="text-gray-500 mt-2 text-sm max-w-sm mx-auto">Get started by creating your very first shiny note!</p>
    </div>
  {:else if filteredNotes.length === 0 && searchQuery}
    <!-- Search Empty State -->
    <div class="py-16 px-6 text-center rounded-2xl">
      <div class="text-gray-300 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No matching notes found</h3>
      <p class="text-gray-500 mt-1 text-sm max-w-sm mx-auto">Try adjusting your search query.</p>
    </div>
  {:else}
    <!-- Content State -->
    {#if $noteStore.error}
      <div class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
        {$noteStore.error}
      </div>
    {/if}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredNotes as note (note.id)}
        <NoteCard {note} on:edit on:delete />
      {/each}
    </div>
  {/if}
</div>
