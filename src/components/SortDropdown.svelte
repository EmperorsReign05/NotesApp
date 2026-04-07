<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  const dispatch = createEventDispatcher();
  
  type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'id-asc' | 'id-desc';
  
  const options: { value: SortOption, label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'id-desc', label: 'Recently Created' },
    { value: 'id-asc', label: 'Oldest Created' }
  ];

  let currentSort: SortOption = 'date-desc';
  let isOpen = false;

  $: currentLabel = options.find(o => o.value === currentSort)?.label || 'Sort by...';

  function handleSelect(value: SortOption) {
    currentSort = value;
    isOpen = false;
    dispatch('sort', currentSort);
  }

  function toggleDropdown(e: Event) {
    e.stopPropagation();
    isOpen = !isOpen;
  }

  function handleWindowClick() {
    if (isOpen) isOpen = false;
  }
</script>

<svelte:window on:click={handleWindowClick} />

<div class="relative w-full sm:w-auto shrink-0 z-40">
  <button 
    type="button"
    on:click={toggleDropdown}
    class="flex items-center justify-between w-full sm:w-[180px] pl-4 pr-3 py-2.5 text-sm font-medium border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all dark:hover:bg-slate-700/50 hover:bg-gray-50"
  >
    <span class="truncate mr-2">{currentLabel}</span>
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ease-in-out {isOpen ? 'transform rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      in:fly={{ y: -5, duration: 150 }} 
      out:fade={{ duration: 100 }}
      class="absolute right-0 mt-2 w-full sm:w-[200px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden flex flex-col py-1.5"
      on:click|stopPropagation
      role="menu"
      tabindex="-1"
    >
      {#each options as option}
        <button 
          class="flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors {currentSort === option.value ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}"
          on:click={() => handleSelect(option.value)}
          role="menuitem"
        >
          {option.label}
          {#if currentSort === option.value}
            <svg class="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
