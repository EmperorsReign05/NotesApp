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

<div class="group {note.colorTheme || 'bg-[#F5CB6A]'} rounded-[24px] p-6 lg:p-8 min-h-[220px] transition-transform hover:-translate-y-1 cursor-pointer flex flex-col h-full relative shadow-sm hover:shadow-md">
  
  <h3 class="text-xl lg:text-2xl font-bold text-gray-900 mb-2 truncate pr-16">{note.title || 'Untitled Note'}</h3>
  <p class="text-[15px] text-gray-800/80 line-clamp-4 leading-relaxed whitespace-pre-wrap flex-grow pr-12">{note.content}</p>
  
  <div class="flex justify-between items-center text-xs font-semibold text-gray-900/60 mt-8">
    <span>{formattedDate}</span>
  </div>

  <div class="absolute bottom-5 right-5 flex gap-2">
    <button 
      type="button"
      class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white/20"
      on:click|stopPropagation={() => dispatch('delete', note)}
      title="Delete Note"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
    <button 
      type="button"
      class="text-white bg-[#111] p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
      on:click|stopPropagation={() => dispatch('edit', note)}
      title="Edit Note"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  </div>
</div>
