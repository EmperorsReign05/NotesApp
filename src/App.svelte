<script lang="ts">
  import NoteList from './components/NoteList.svelte';
  import CreateNoteModal from './components/CreateNoteModal.svelte';

  let showCreateModal = false;

  function toggleCreateModal() {
    showCreateModal = !showCreateModal;
  }
</script>

<main class="min-h-screen bg-[#F8FAFC] text-gray-900 py-10 px-4 sm:px-6 lg:px-8 relative">
  <div class="max-w-6xl mx-auto">
    <header class="mb-10 text-center sm:text-left flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">My Notes</h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">Capture your thoughts, ideas, and tasks.</p>
      </div>
      
      <button 
        on:click={toggleCreateModal}
        class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg class="w-5 h-5 mr-1.5 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Note
      </button>
    </header>

    <NoteList />
  </div>
</main>

{#if showCreateModal}
  <CreateNoteModal on:close={toggleCreateModal} />
{/if}

<style>
  :global(body) {
    background-color: #F8FAFC;
  }
</style>
