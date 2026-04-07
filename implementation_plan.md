# Final Requirements Strike Plan

We are almost at 100% completion against your rubric. We've built an incredible Docker Note styled app with solid operations, animations, and clean Svelte logic. Now we must clean up the remaining structural requirements.

## Goal Description
To ensure the project achieves a perfect score by fulfilling every single requirement listed in your rubric, specifically focusing on the README, custom 404, offline sync, debounced search, and the GitHub footer link.

## Proposed Changes

### Phase 1: 404 Routing & Link Footer
- **[MODIFY] `src/App.svelte`**:
  - We will implement a lightweight manual router. If `window.location.pathname` is anything other than `/`, we will render a sleek custom 404 component instead of the `NoteList`.
  - We will add a small, styled footer at the bottom of the main container displaying a link to your GitHub (`EmperorsReign05`).

### Phase 2: Debounced Search
- **[MODIFY] `src/components/SearchBar.svelte`**:
  - Implement a 300ms debounce timer for the `searchQuery` so we don't spam the UI updates for every keystroke. This fulfills the performance requirement.

### Phase 3: True Offline Sync Loop
- **[MODIFY] `src/stores/noteStore.ts`**:
  - Currently, we cache notes locally for offline rendering. To fulfill the strict "sync when connectivity is regained" requirement, we will:
  - Intercept POST/PUT/DELETE failures when `!navigator.onLine`.
  - Push these operations to an `offlineQueue` in `localStorage`.
  - Add a `window.addEventListener('online', syncQueue)` that will automatically replay these operations and flush the queue in the background.

### Phase 4: README Documentation
- **[NEW] `README.md`**:
  - Write a comprehensive README.
  - Compute the exact SHA-256 hash of `EmperorsReign05` and place it perfectly on the first line.
  - Document the build instructions, tradeoffs, and a reflection focusing on the ambitious "Docket Note" custom feature.

## User Review Required

> [!IMPORTANT]  
> Are you ready for me to execute this final sprint of requirements? Please approve this plan so we can officially finish this incredible application!
