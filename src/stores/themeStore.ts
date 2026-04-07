import { writable } from 'svelte/store';

function createThemeStore() {
  const isBrowser = typeof window !== 'undefined';
  
  // Detect previous preference or fallback to system preference
  const getInitialTheme = () => {
    if (!isBrowser) return 'light';
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const initialTheme = getInitialTheme();
    
  if (isBrowser && initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (isBrowser) {
    document.documentElement.classList.remove('dark');
  }

  const { subscribe, update } = writable<'light' | 'dark'>(initialTheme as 'light' | 'dark');

  return {
    subscribe,
    toggle: () => {
      update(current => {
        const next = current === 'light' ? 'dark' : 'light';
        if (isBrowser) {
          localStorage.setItem('theme', next);
          if (next === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return next;
      });
    }
  };
}

export const themeStore = createThemeStore();
