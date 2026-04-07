<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { toastStore } from '../stores/toastStore';
  import { onMount, onDestroy } from 'svelte';

  // We want to force Svelte to re-evaluate the scale for the bar
  let now = Date.now();
  let rafId: number;

  onMount(() => {
    const updateTime = () => {
      now = Date.now();
      rafId = requestAnimationFrame(updateTime);
    };
    updateTime();
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>

<div class="fixed bottom-6 w-full pointer-events-none z-[100] flex flex-col items-center gap-3">
  {#each $toastStore as toast (toast.id)}
    <div 
      in:fly={{ y: 20, duration: 300 }} 
      out:fade={{ duration: 200 }}
      class="bg-gray-800 text-white rounded-xl shadow-xl flex items-center justify-between min-w-[320px] max-w-sm pointer-events-auto overflow-hidden relative"
    >
      <div class="flex-grow px-5 py-3.5 flex items-center gap-3">
        {#if toast.type === 'undo'}
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        {/if}
        <span class="text-sm font-medium">{toast.message}</span>
      </div>

      {#if toast.type === 'undo'}
        <div class="pr-2 py-2">
          <button 
            class="text-blue-400 hover:text-blue-300 font-semibold text-sm tracking-wide px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors uppercase"
            on:click={() => {
              if (toast.onUndo) toast.onUndo();
              toastStore.removeToast(toast.id);
            }}
          >
            Undo
          </button>
        </div>
        
        <!-- 10s progress bar -->
        <div class="absolute bottom-0 left-0 h-1 bg-white/20 w-full origin-left animate-[shrink_10s_linear_forwards]"></div>
      {/if}
    </div>
  {/each}
</div>

<style>
  @keyframes shrink {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
</style>
