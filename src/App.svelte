<script lang="ts">
  import NoteList from './components/NoteList.svelte';
</script>

<main class="min-h-screen bg-[#F8FAFC] text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <header class="mb-10 text-center sm:text-left flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">My Notes</h1>
        <p class="mt-2 text-sm text-gray-500 font-medium">Capture your thoughts, ideas, and tasks.</p>
      </div>
      <!-- Add note button placeholder to keep layout ready for Phase 3 -->
    </header>

    <NoteList />
  </div>
</main>

<style>
  :global(body) {
    background-color: #F8FAFC;
  }
</style>
