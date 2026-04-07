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
<div class="flex items-center justify-center gap-2 mt-12 bg-white/50 py-3 px-6 rounded-2xl mx-auto w-fit backdrop-blur-sm border border-gray-100">
  <button 
    disabled={currentPage === 1}
    on:click={() => goToGroup(currentPage - 1)}
    class="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
  >
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    Prev
  </button>
  
  <span class="text-sm text-gray-500 font-semibold px-4 tabular-nums">
    <span class="text-gray-900">{currentPage}</span> / {totalPages}
  </span>

  <button 
    disabled={currentPage === totalPages}
    on:click={() => goToGroup(currentPage + 1)}
    class="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
  >
    Next
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>
{/if}
