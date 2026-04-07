<script lang="ts">
  import { noteStore } from '../stores/noteStore';
  
  $: activeNote = $noteStore.notes.find(n => n.id === $noteStore.activeNoteId);
  
</script>

<div class="flex-1 h-full bg-white dark:bg-[#0A0A0A] flex flex-col overflow-hidden relative">
  {#if activeNote}
    <header class="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div class="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
        <button class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"><span class="font-bold font-serif w-4 h-4 flex items-center justify-center">B</span></button>
        <button class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"><span class="italic font-serif w-4 h-4 flex items-center justify-center">I</span></button>
        <button class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"><span class="line-through font-serif w-4 h-4 flex items-center justify-center">S</span></button>
      </div>
      <div class="flex items-center gap-2">
        <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>
      </div>
    </header>
    
    <div class="flex-1 overflow-y-auto px-12 py-10">
      <div class="max-w-3xl mx-auto">
        <input 
          class="w-full bg-transparent text-4xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-slate-700 outline-none mb-6"
          placeholder="Untitled"
          value={activeNote.title}
        />
        <textarea 
          class="w-full h-full min-h-[500px] bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-slate-600 outline-none resize-none leading-relaxed text-lg"
          placeholder="Type / for commands..."
          value={activeNote.content}
        ></textarea>
      </div>
    </div>
  {:else}
    <div class="flex-1 flex items-center justify-center text-gray-400 dark:text-slate-600 flex-col gap-4">
      <svg class="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p>Select a note to view</p>
    </div>
  {/if}
</div>
