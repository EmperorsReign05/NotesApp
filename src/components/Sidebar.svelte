<script lang="ts">
  import { noteStore } from '../stores/noteStore';

  function handleMainCreate() {
    const lastColor = $noteStore.notes.length > 0 ? $noteStore.notes[0].colorTheme : 'bg-[#F5CB6A]';
    noteStore.addNote({ title: '', content: '', colorTheme: lastColor });
  }
</script>

<aside class="w-[72px] h-full bg-white dark:bg-[#111] border-r border-gray-100 dark:border-slate-800 flex flex-col items-center py-8 shrink-0 overflow-hidden relative z-10 transition-colors shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
  
  <button 
    class="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg mb-12"
    title="New Note"
    on:click={handleMainCreate}
  >
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
    </svg>
  </button>

  <div class="flex flex-col gap-5 items-center">
    {#each ['bg-[#F5CB6A]', 'bg-[#F6A071]', 'bg-[#B282F3]', 'bg-[#19D3EA]', 'bg-[#D3EE7E]'] as color}
      <button 
        class="w-3.5 h-3.5 rounded-full {color} hover:scale-[1.3] transition-transform shadow-sm focus:outline-none"
        title="Create note with this color"
        on:click={() => noteStore.addNote({ title: '', content: '', colorTheme: color })}
      ></button>
    {/each}
  </div>

</aside>
