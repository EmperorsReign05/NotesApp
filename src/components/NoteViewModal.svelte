<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { Note } from '../types/note';

  export let note: Note;
  
  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');

  $: formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="0" aria-label="Close modal"></div>

  <!-- Modal Content -->
  <div 
    class="relative {note.colorTheme || 'bg-[#F5CB6A]'} rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl" 
    in:scale={{ duration: 300, start: 0.95, easing: quintOut }} 
    out:scale={{ duration: 200, start: 0.95 }}
  >
    <div class="p-8 sm:p-12">
      <div class="flex justify-between items-start mb-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight pr-8">{note.title || 'Untitled Note'}</h2>
        <button 
          on:click={close}
          class="shrink-0 p-2 text-gray-900/60 hover:text-gray-900 hover:bg-black/5 rounded-full transition-colors focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="prose prose-lg prose-gray max-w-none text-gray-900/90 whitespace-pre-wrap leading-relaxed mb-12">
        {note.content}
      </div>

      <div class="flex justify-between items-end border-t border-black/10 pt-6 mt-auto">
        <span class="text-sm font-semibold text-gray-900/60">{formattedDate}</span>
        
        <div class="flex gap-3">
          <button 
            type="button"
            class="text-gray-700 bg-black/5 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 focus:outline-none"
            on:click={() => dispatch('delete', note)}
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          
          <button 
            type="button"
            class="text-white bg-[#111] hover:bg-black px-6 py-2 rounded-full font-medium transition-transform hover:scale-105 shadow-md flex items-center gap-2 focus:outline-none"
            on:click={() => dispatch('edit', note)}
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Note
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
