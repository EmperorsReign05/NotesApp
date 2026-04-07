<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Note } from '../types/note';

  export let note: Note;
  
  const dispatch = createEventDispatcher();

  $: formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
</script>

<div class="group bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex flex-col h-full relative">
  <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-200 dark:border-slate-600 p-0.5">
    <button 
      type="button"
      class="text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
      on:click={() => dispatch('edit', note)}
      title="Edit Note"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
    <button 
      type="button"
      class="text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
      on:click={() => dispatch('delete', note)}
      title="Delete Note"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>

  <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 truncate pr-14">{note.title || 'Untitled Note'}</h3>
  <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-snug whitespace-pre-wrap flex-grow">{note.content}</p>
  <div class="flex justify-between items-center text-xs text-gray-400 dark:text-slate-500 mt-auto pt-3 border-t border-gray-100 dark:border-slate-700/50">
    <span>{formattedDate}</span>
  </div>
</div>
