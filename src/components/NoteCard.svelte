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

<div class="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col h-full relative">
  <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
    <button 
      class="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors bg-white/80 backdrop-blur-sm"
      on:click={() => dispatch('edit', note)}
      title="Edit Note"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  </div>

  <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate pr-8">{note.title || 'Untitled Note'}</h3>
  <p class="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed whitespace-pre-wrap flex-grow">{note.content}</p>
  <div class="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
    <span>{formattedDate}</span>
  </div>
</div>
