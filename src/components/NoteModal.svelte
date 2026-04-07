<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { noteStore } from '../stores/noteStore';
  import type { Note } from '../types/note';

  export let editingNote: Note | null = null;
  const isEditing = !!editingNote;

  const dispatch = createEventDispatcher();

  let title = editingNote?.title || '';
  let content = editingNote?.content || '';
  let submitting = false;
  let validationError = '';
  
  let titleInput: HTMLInputElement;

  onMount(() => {
    if (titleInput) titleInput.focus();
  });

  const close = () => dispatch('close');

  async function handleSubmit() {
    validationError = '';
    
    // Strict Validation
    if (!title.trim()) {
      validationError = 'Oops! Your note needs a title.';
      return;
    }
    if (!content.trim()) {
      validationError = 'Don\'t forget to add some content to your note!';
      return;
    }

    submitting = true;
    try {
      if (isEditing && editingNote) {
        await noteStore.editNote(editingNote.id, { title: title.trim(), content: content.trim() });
      } else {
        await noteStore.addNote({ title: title.trim(), content: content.trim() });
      }
      close();
    } catch (err) {
      validationError = `Failed to ${isEditing ? 'update' : 'save'} note. Please try again.`;
      submitting = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 z-50 flex items-center justify-center p-4" in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" on:click={close}></div>

  <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-transparent dark:border-slate-700" in:scale={{ start: 0.95, duration: 150 }} out:scale={{ start: 0.95, duration: 150 }}>
    <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
      <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700" on:click={close}>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form class="p-6 flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
      {#if validationError}
        <div class="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-2" in:fade={{ duration: 100 }}>
          <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {validationError}
        </div>
      {/if}

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input 
          bind:this={titleInput}
          id="title"
          bind:value={title}
          type="text" 
          placeholder="What's this about?"
          class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={submitting}
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
        <textarea 
          id="content"
          bind:value={content}
          rows="6"
          placeholder="Write your beautiful thoughts here..."
          class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={submitting}
        ></textarea>
      </div>

      <div class="mt-4 flex justify-end gap-3 pt-2">
        <button 
          type="button" 
          on:click={close}
          class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={submitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          disabled={submitting}
        >
          {#if submitting}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Saving...
          {:else}
            {isEditing ? 'Save Changes' : 'Create Note'}
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
