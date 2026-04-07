<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let title = 'Confirm Action';
  export let message = 'Are you sure you want to proceed?';
  export let confirmText = 'Confirm';
  export let confirmColor = 'red'; // e.g., 'red', 'blue'

  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');
  const confirm = () => dispatch('confirm');
</script>

<div class="fixed inset-0 z-[60] flex items-center justify-center p-4" in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" on:click={close}></div>

  <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center" in:scale={{ start: 0.95, duration: 150 }} out:scale={{ start: 0.95, duration: 150 }}>
    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
      <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-lg leading-6 font-semibold text-gray-900">{title}</h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500 max-w-[250px] mx-auto">{message}</p>
    </div>
    <div class="mt-8 flex justify-center gap-3">
      <button type="button" class="flex-1 justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" on:click={close}>Cancel</button>
      <button type="button" class="flex-1 justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" on:click={confirm}>{confirmText}</button>
    </div>
  </div>
</div>
