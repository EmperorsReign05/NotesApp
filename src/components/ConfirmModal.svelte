<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let title = 'Confirm Action';
  export let message = 'Are you sure you want to proceed?';
  export let confirmText = 'Confirm';

  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');
  const confirm = () => dispatch('confirm');
</script>

<div class="fixed inset-0 z-[60] flex items-center justify-center p-4" in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="absolute inset-0 bg-gray-900/40" on:click={close}></div>

<div class="relative bg-white dark:bg-slate-800 rounded-lg shadow-sm w-full max-w-sm overflow-hidden flex flex-col p-6 text-center border border-gray-200 dark:border-slate-700" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
    <div class="mx-auto flex items-center justify-center h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/10 mb-4 border border-red-100 dark:border-red-900/30">
      <svg class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">{title}</h3>
    <div class="mt-2">
      <p class="text-sm text-gray-500 dark:text-slate-400 max-w-[250px] mx-auto">{message}</p>
    </div>
    <div class="mt-6 flex justify-center gap-2">
      <button type="button" class="flex-1 justify-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-none rounded-lg" on:click={close}>Cancel</button>
      <button type="button" class="flex-1 justify-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-none rounded-lg" on:click={confirm}>{confirmText}</button>
    </div>
  </div>
</div>
