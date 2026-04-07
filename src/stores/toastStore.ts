import { writable } from 'svelte/store';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'undo';
  onUndo?: () => void;
  timer?: ReturnType<typeof setTimeout>;
};

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    addToast: (message: string, type: 'success' | 'undo' = 'success', onUndo?: () => void) => {
      const id = Date.now().toString();
      
      const timer = setTimeout(() => {
        update(toasts => toasts.filter(t => t.id !== id));
      }, type === 'undo' ? 10000 : 3000);

      update(toasts => [...toasts, { id, message, type, onUndo, timer }]);
      return id;
    },
    removeToast: (id: string) => {
      update(toasts => {
        const toast = toasts.find(t => t.id === id);
        if (toast?.timer) clearTimeout(toast.timer);
        return toasts.filter(t => t.id !== id);
      });
    }
  };
}

export const toastStore = createToastStore();
