<script lang="ts">
  import type { Note } from '../types/note';

  export let note: Note;
  
  $: formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
  <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">{note.title || 'Untitled Note'}</h3>
  <p class="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed whitespace-pre-wrap flex-grow">{note.content}</p>
  <div class="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
    <span>{formattedDate}</span>
    <!-- Action buttons block placeholder -->
  </div>
</div>
