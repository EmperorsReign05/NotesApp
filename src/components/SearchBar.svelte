<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { debounce } from '../utils/debounce';

  const dispatch = createEventDispatcher();
  export let placeholder = 'Search notes...';

  let query = '';

  const emitSearch = debounce((q: string) => {
    dispatch('search', q);
  }, 400); // 400ms debounce as requested

  // Reactively call emitSearch whenever query changes
  $: emitSearch(query);
</script>

<div class="relative w-full max-w-sm flex-1">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <input
    type="text"
    bind:value={query}
    class="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
    {placeholder}
  />
</div>
