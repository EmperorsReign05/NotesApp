5c240fb848c253b338c834d18c58be97e956c23ff0f260a6d66f0b283eb15b03

# Notes App
A modern and responsive note-taking application inspired by Docket. Built with Svelte, TailwindCSS, and a massive focus on user experience.


https://github.com/user-attachments/assets/7ab758b4-b6df-4c11-9f0d-4ce12694f947


## Links
- **Live Demo:** [View Deployed App on Netlify](https://notes-app-emperor.netlify.app/)



## Features

This application successfully implements all prompt requirements and several bonus additions:

### Core functionality:
- Full CRUD operations interacting with mockAPI.
- Offline synchronization: Creates, edits, and deletes are queued when offline and effortlessly synced when connectivity is restored.
- Advanced debounced search (400ms) with intuitive empty states.
- Reversible soft-deletes (10-second undo window via toast).
- Note sorting by latest (default), oldest, alphabetical, and id.
- Custom 404 minimal aesthetics page for invalid routes.

### Additions (The "Docket" Visual Architecture)
Focused deeply on **Themed Visual Note Organization** and **Advanced Keyboard Shortcuts**.
I designed the app drawing inspiration from "Dynamic Dockets." When you create a note, it is dynamically assigned a beautifully calibrated pastel gradient "colorTheme". This visually breaks apart a bland grid of notes into a vibrant ecosystem. Furthermore, intuitive navigational shortcuts (like `CTRL+K` to search, or `ALT+N` to jump to note creation, or pressing `ESCAPE` everywhere to close modals) transform the app into a power-user tool.

## Setup and Deployment

### How to Run Locally

1. Clone the repository: `git clone https://github.com/EmperorsReign05/NotesApp.git`
2. Enter the directory: `cd NotesApp`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

### How to Deploy

To deploy to production (e.g., Netlify, Vercel, configuring standard Vite projects):
1. Build the production app: `npm run build`
2. The bundled assets will be generated in the `dist` folder.
3. Serve or upload the `dist` folder to your provider of choice. Since it's a Svelte SPA, ensure your server is configured to rewrite all routes to `index.html` to support client-side routing.

## Reflection

I approached this project as though I were building a tier-one internal product. I initially focused heavily on setting up clean stores (`noteStore.ts` & `toastStore.ts`) to centralize the state management. That structure directly enabled complex features like optimistic UI and offline soft-deletes. The design phase was meticulous, avoiding default CSS frameworks to leverage precise Tailwind utilities and Svelte transitions to craft a delightful user experience. 

## Trade-offs and Assumptions

1. **Client-side vs Server-side search & sort**: I assumed the scale of notes per user would comfortably fit into the application's memory once fetched, allowing lightning-fast filtering and sorting locally instead of relying on round-trip queries to the API. This greatly enhances perceived speed (debounce local search).
2. **Offline Logic**: With a more robust backend, I'd implement explicit conflict resolution via CRDTs or row-versioning for the offline sync queue. Here, I assumed a "last write wins" approach since only one user context exists.
3. **Environment Variables Strategy**: Unlike standard production applications where `.env` files are strictly added to `.gitignore`, I explicitly chose to commit the base `.env` file containing the `VITE_API_BASE_URL`. Since this is a public MockAPI URL containing zero sensitive secrets, keeping it in the repo ensures the application works effortlessly out of the box when cloned and run by evaluators.

## Additional Dependencies

There were no massive dependencies added beyond Svelte and Tailwind. However, I did rely on native APIs and basic ecosystem utilities.
- **Vite & PostCSS:** Used to establish a modern, lightning-fast compilation pipeline out of the box. 
- **eslint-plugin-svelte & svelte-check:** Added to enforce robust typing and linting across `.svelte` files. 

