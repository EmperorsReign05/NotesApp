import './app.css'
import App from './App.svelte'
import { noteService } from './services/noteService'; window.noteService = noteService;
const app = new App({
  target: document.getElementById('app')!,
})

export default app
