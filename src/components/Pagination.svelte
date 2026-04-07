<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let currentPage = 1;
  export let totalPages = 1;

  const dispatch = createEventDispatcher();

  function goToGroup(page: number) {
    if (page >= 1 && page <= totalPages) {
       dispatch('pageChange', page);
       // Scroll to top of list smoothly
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
</script>

{#if totalPages > 1}
<div class="flex items-center justify-center gap-2 mt-6 py-2 px-4 rounded-lg mx-auto w-fit border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/20">
  <button 
    disabled={currentPage === 1}
    on:click={() => goToGroup(currentPage - 1)}
    class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-none flex items-center gap-1"
  >
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Prev
  </button>
  
  <span class="text-sm text-gray-500 dark:text-slate-400 font-medium px-4 tabular-nums">
    <span class="text-gray-900 dark:text-gray-100">{currentPage}</span> / {totalPages}
  </span>

  <button 
    disabled={currentPage === totalPages}
    on:click={() => goToGroup(currentPage + 1)}
    class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-none flex items-center gap-1"
  >
    Next
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>
{/if}
