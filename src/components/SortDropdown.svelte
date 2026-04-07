<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'id-asc' | 'id-desc';
  
  let currentSort: SortOption = 'date-desc';

  function handleChange() {
    dispatch('sort', currentSort);
  }
</script>

<div class="relative w-full sm:w-auto shrink-0">
  <select 
    bind:value={currentSort} 
    on:change={handleChange}
    class="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all cursor-pointer appearance-none"
  >
    <option value="date-desc">Newest First</option>
    <option value="date-asc">Oldest First</option>
    <option value="title-asc">Title (A-Z)</option>
    <option value="title-desc">Title (Z-A)</option>
    <option value="id-desc">Recently Created</option>
    <option value="id-asc">Oldest Created</option>
  </select>
  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
</div>
